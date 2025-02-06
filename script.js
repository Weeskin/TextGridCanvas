"use strict"

const e_matrixMixerComponents = {
    AudioSources : 0,
    AudioReceiver : 1,
    mixDisplay : 2,
    last : 3
};

const e_matrixMixerHeaders = {
    cardName : 0 ,
    channelGroupe : 1 ,
    channelName : 2 ,
    last : 3
};

const e_matrixMixerCells = {
    cells : 0,
    last: 1
}

//enum pour specifier les deux div (alias et vuMeter) au sein de ChannelName lie a l'appel de la fonction childNodes
const e_channelNameContent = {
    alias : 0 ,
    vuMeter : 1,
    emptyAlias: 2,
    last : 3
};


class gridMatrix {
    constructor(p_containerSelector) {
        this.m_ChannelGroupeRange = 8 ;
        this.m_nbCards = 1 ;
        this.m_nbCols = 64;
        this.m_nbRows = 64
        this.m_matrixMixer = document.getElementById(p_containerSelector);
        this.m_matrixMixerData = new Array(e_matrixMixerComponents.last);
        // this.m_AudioWay = 0;
        this.m_AudioWayMixerInput = 1;
        this.m_minTrim = -80.1
        this.m_maxTrim = -80.1
        
        this.m_cardAlias = ["ADSP-Pierre"]
        this.m_nbCards = this.m_cardAlias.length;


        this.init();
    }

    init() {
        this.initAnEmptyMatrixMixerData();
        this.createMixerDataHeaders();
        console.log(this.m_matrixMixerData);
        this.addEventListeners();
    }

    initAnEmptyMatrixMixerData() {
        //Initialisation de tableau vide pour chaque carte
        for (let l_mixerComponentIdx = 0; l_mixerComponentIdx < e_matrixMixerComponents.last; l_mixerComponentIdx++) {
            this.m_matrixMixerData[l_mixerComponentIdx] = [];
            const headersOrCells = l_mixerComponentIdx === e_matrixMixerComponents.mixDisplay ? e_matrixMixerCells : e_matrixMixerHeaders;
            for (let l_idx = 0; l_idx < headersOrCells.last; l_idx++) {
                this.m_matrixMixerData[l_mixerComponentIdx][l_idx] = [];
            }
        }
    }

    initAnEmptyContainer() {
        //Création container en haut à gauche vide
        let l_emptyContainer = document.createElement("div");
        l_emptyContainer.classList.add("emptyContainer");
        return l_emptyContainer
    }

    createMixerDataHeaders() {
        // Traitement des sources input = colonnes ou output = lignes
        for (let p_source of [true, false]) {
            const l_matrixMixerData = this.m_matrixMixerData[p_source ? e_matrixMixerComponents.AudioSources : e_matrixMixerComponents.AudioReceiver];
            const l_nbChannels = p_source ? this.m_nbCols : this.m_nbRows;
            const l_tbxOfIntervals = this.getIntervals(l_nbChannels, this.m_ChannelGroupeRange);
            const l_divHeaderContainer = document.createElement("div");
            l_divHeaderContainer.classList.add(`${p_source ? "columns" : "rows"}Container`);

            if (p_source) {
                l_divHeaderContainer.appendChild(this.initAnEmptyContainer());
            }

            // Parcours des cartes
            for (let l_cardIdx = 0; l_cardIdx < this.m_nbCards; l_cardIdx++) {
                // Ajout des en-têtes (colonne ou ligne) pour chaque carte
                if (this.fctDrawHeaderContainer) {
                    let l_fctDrawHeaderContainer = this.fctDrawHeaderContainer(p_source, l_cardIdx);
                    l_matrixMixerData[e_matrixMixerHeaders.cardName].push(l_fctDrawHeaderContainer);
                    l_divHeaderContainer.appendChild(l_fctDrawHeaderContainer);

                    // Creation d'une div pour rassembler les noms des intervals pour pouvoir les mettre en lignes ou en colonnes
                    let l_channelsGroups = document.createElement("div");
                    l_channelsGroups.classList.add(`divForAll${p_source ? "Col" : "Row"}ChannelsGroups`);
                    l_fctDrawHeaderContainer.appendChild(l_channelsGroups);

                    for (let l_IdxGrp = 0; l_IdxGrp < l_tbxOfIntervals.length; l_IdxGrp++) {  // ! \\ : l_tbxOfIntervals base sur this.m_ChannelGroupeRange = 8
                        //Creations des noms des intervals
                        let l_fctDrawChannelGroups = this.fctDrawChannelGroups(p_source, l_cardIdx, l_tbxOfIntervals[l_IdxGrp], l_IdxGrp);
                        l_matrixMixerData[e_matrixMixerHeaders.channelGroupe].push(l_fctDrawChannelGroups);
                        l_channelsGroups.appendChild(l_fctDrawChannelGroups);

                        // Creation d'une div pour rassembler les noms des canaux pour pouvoir les mettre en lignes ou en colonnes
                        let l_channelsNames = document.createElement("div");
                        l_channelsNames.classList.add(`divForAll${p_source ? "Col" : "Row"}ChannelsNames`);
                        l_fctDrawChannelGroups.appendChild(l_channelsNames);

                        for (let l_idxChannel = l_IdxGrp * this.m_ChannelGroupeRange; l_idxChannel < ((l_IdxGrp + 1) * this.m_ChannelGroupeRange); l_idxChannel++) {
                            // Creation des noms de canaux
                            let l_fctDrawChannelName = this.fctDrawChannelName(p_source, l_idxChannel);
                            l_matrixMixerData[e_matrixMixerHeaders.channelName].push(l_fctDrawChannelName);
                            l_channelsNames.appendChild(l_fctDrawChannelName);

                            //Creation des cellules par ligne
                            if (!p_source) {
                                for (let l_idxCol = 0; l_idxCol < this.m_nbCols; l_idxCol++) {
                                    let l_cell = this.fctDrawCell(l_idxCol, l_idxChannel);
                                    l_fctDrawChannelName.appendChild(l_cell);
                                    this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells].push(l_cell);
                                }
                            }
                        }
                    }
                }
            }
            this.m_matrixMixer.appendChild(l_divHeaderContainer);
        }
    }

    fctDrawHeaderContainer(p_source, p_cardIdx) {
        // Main div
        let l_cardNameElement = document.createElement("div");
        l_cardNameElement.classList.add(`${p_source?"col":"row"}CardName${p_cardIdx}`);
        // Title Div
        let l_cardTitleElement = document.createElement("div");
        l_cardTitleElement.classList.add(`${p_source?"col":"row"}CardTitle`);
        l_cardTitleElement.textContent = "AxC-ADSP-" + (p_cardIdx + 1);

        l_cardNameElement.appendChild(l_cardTitleElement)
        return l_cardNameElement ;
    }

    fctDrawChannelGroups(p_source, p_cardIdx , p_intervalsNames, p_idxInterval){
        // Main div
        let l_groupNameElement = document.createElement("div");
        l_groupNameElement.classList.add(`${p_source?"col":"row"}ChannelGroups`);
        // Title Div
        let  l_groupTitleElement  = document.createElement("div");
        l_groupTitleElement.classList.add(`${p_source?"col":"row"}ChannelGroupsTitle`);
        l_groupTitleElement.classList.add(`crossWidth`);
        l_groupTitleElement.textContent = p_intervalsNames;
        l_groupTitleElement.appendChild(this.drawMinusPlusBtn(p_cardIdx , p_source , p_idxInterval));

        l_groupNameElement.appendChild(l_groupTitleElement);
        return l_groupNameElement;
    }

    fctDrawChannelName(p_source, p_channelIdx){
        // Main div
        let l_channelElement = document.createElement("div");
        l_channelElement.classList.add(`${p_source ?"col":"row"}ChannelName`);
        l_channelElement.classList.add(`cross${p_source?"Width":"Height"}`);

        if (p_source && p_channelIdx % 8 === 7 && p_channelIdx !== this.m_nbCols - 1) {
            l_channelElement.style.borderRight = "3px solid rgba(255, 255, 255, 0.13)";
        }

        // Title Div (e_channelNameContent.alias = 0)
        let l_channelTitleElement = document.createElement("div")
        l_channelTitleElement.classList.add(`${p_source?"col":"row"}ChannelNameTitle`);
        l_channelTitleElement.classList.add(`crossWidth`);
        l_channelTitleElement.textContent = `${p_source?"Input":"Output"} ${p_channelIdx+1}` ;
        l_channelElement.appendChild(l_channelTitleElement);

        // Vu meters (e_channelNameContent.vuMeter = 1)
        let l_channelVuMeter = this.fctDrawChannelVuMeter(p_source);

        l_channelElement.appendChild(l_channelTitleElement);
        l_channelElement.appendChild(l_channelVuMeter);

        // Empty div for alias on !p_source (e_channelNameContent.vuMeter = 2)
        let l_emptyAliasContainer = document.createElement("div");
        l_emptyAliasContainer.classList.add("emptyAliasContainer");
        l_emptyAliasContainer.style.display = "none";
        if (!p_source) {
            l_channelElement.appendChild(l_emptyAliasContainer);
        }

        return l_channelElement;
    }

    fctDrawChannelVuMeter(p_source) {
        // Création du vuMeter en canvas
        let l_vuMeterCanvas = document.createElement("canvas");
        l_vuMeterCanvas.classList.add(`${p_source ? "col" : "row"}VuMeterMatrixMixerCanvas`);
        l_vuMeterCanvas.width = 10;
        l_vuMeterCanvas.height = 22;

        let l_VuMeterContext = l_vuMeterCanvas.getContext("2d");
        let l_gradient = l_VuMeterContext.createLinearGradient(0, 0, 0, l_vuMeterCanvas.height);
        l_gradient.addColorStop(0, "red");
        l_gradient.addColorStop(0.3, "orange");
        l_gradient.addColorStop(0.6, "yellow");
        l_gradient.addColorStop(1, "green");
        l_VuMeterContext.fillStyle = l_gradient;

        return l_vuMeterCanvas;
    }

    fctDrawCell(p_colsIdx, p_rowsIdx){
        //Création des cellules
        let l_cells = document.createElement("div");
        l_cells.classList.add( "cell");
        l_cells.setAttribute('data-row', `${p_rowsIdx + 1}` );
        l_cells.setAttribute('data-col', `${p_colsIdx + 1}`);
        l_cells.classList.add(`crossWidth`);    //20px
        l_cells.classList.add(`crossHeight`);   //20px
        
        // Ajouter un borderRight pour la premiere colonne
        if (p_colsIdx === 0) {
            l_cells.style.borderLeft = "6px solid rgba(255, 255, 255, 0.13)";
        }

        if (p_colsIdx % 8 === 7 && p_colsIdx !== this.m_nbCols - 1) {
            l_cells.style.borderRight = "3px solid rgba(255, 255, 255, 0.13)";
        }

        let cellValue = parseFloat(l_cells.textContent);
        if (!isNaN(cellValue)) {
            l_cells.textContent = cellValue.toFixed(1);
        }
        
        // // Debug
        // if ( p_colsIdx === p_rowsIdx ){
        //     l_cells.innerHTML = `${(p_colsIdx/this.m_ChannelGroupeRange)}`;
        // }
        return l_cells;
    }
    
    getIntervals(p_nbChannels, p_channelGroupeRange) {
        //Création des intervals
        let l_intervals = [];
        for (let l_idxIntervalNumber = 0; l_idxIntervalNumber < p_nbChannels; l_idxIntervalNumber += p_channelGroupeRange) {
            let start = l_idxIntervalNumber + 1;
            let end = Math.min(l_idxIntervalNumber + p_channelGroupeRange, p_nbChannels);
            l_intervals.push(`${start} - ${end}`);
        }
        return l_intervals;
    }
    
    //Toggle Minus Plus Button
    drawMinusPlusBtn(p_source, p_cardIdx, p_idxInterval) {
        const l_btn = document.createElement("button");
        l_btn.textContent = "-";
        l_btn.classList.add(`minus-btn`);
        l_btn.classList.add(`crossWidth`);
        l_btn.classList.add(`crossHeight`);
        l_btn.addEventListener('mousedown', () => {
            l_btn.textContent = l_btn.textContent === "-" ? "+" : "-";
            this.onMouseDownMinusPlusBtn(p_source, p_cardIdx, p_idxInterval);
        });

        return l_btn;
    }

    onMouseDownMinusPlusBtn(p_source, p_cardIdx, p_idxInterval) {
        const l_matrixHeaderCtx = p_source ? this.m_matrixMixerData[e_matrixMixerComponents.AudioSources] : this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver];
        const l_startChannel = p_idxInterval * this.m_ChannelGroupeRange;
        const l_lastChannel = l_startChannel + this.m_ChannelGroupeRange;
        // on regarde l'etat courant du nom du canal pour savoir si on est en mode resume ou non
        const l_isResume = l_matrixHeaderCtx[e_matrixMixerHeaders.channelName][l_startChannel + 1].style.display === "";

        this.collapseChannels(p_source,l_startChannel, l_lastChannel, l_matrixHeaderCtx, l_isResume);
        this.collapseCells(p_source, l_startChannel, l_lastChannel, l_isResume);
    }

    collapseChannels(p_source, p_startChannel, p_lastChannel, p_matrixHeaderCtx, p_isResume) {
        const aliasElement = p_matrixHeaderCtx[e_matrixMixerHeaders.channelName][p_startChannel].childNodes[e_channelNameContent.alias];
        const vuMeterElement = p_matrixHeaderCtx[e_matrixMixerHeaders.channelName][p_startChannel].childNodes[e_channelNameContent.vuMeter];
        const aliasEmptyElement = p_matrixHeaderCtx[e_matrixMixerHeaders.channelName][p_startChannel].childNodes[e_channelNameContent.emptyAlias];
        const displayToggle = p_isResume ? "none" : "";

        for (let l_idxChannelName = p_startChannel + 1; l_idxChannelName < p_lastChannel; l_idxChannelName++) {
            p_matrixHeaderCtx[e_matrixMixerHeaders.channelName][l_idxChannelName].style.display = displayToggle;
        }

        aliasElement.style.display = displayToggle;
        vuMeterElement.style.display = displayToggle;
        if (!p_source) {
            aliasEmptyElement.style.display = p_isResume ? "" : "none";
        }
    }

    collapseCells(p_source, p_startChannel, p_lastChannel, p_isResume) {
        //Inversement d'AudioReceiver et AudioSources, car on veut verifier les colonnes pour AudioReceiver et les lignes pour AudioSources
        const l_matrixHeaderCtx = p_source ? this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver] : this.m_matrixMixerData[e_matrixMixerComponents.AudioSources];
        let  l_nextIsResume = l_matrixHeaderCtx[e_matrixMixerHeaders.channelName][p_startChannel + 1].style.display !== "";

        if (p_source) {
            this.foldColumnsCells( p_source, p_startChannel,  p_lastChannel, p_isResume,l_nextIsResume );
        } else {
            this.foldRowsCells(p_source, p_startChannel, p_lastChannel, p_isResume,l_nextIsResume);
        }
    }

    foldColumnsCells(p_source, p_startChannel, p_lastChannel, p_isResume) {
        // Quand je plie la colonne, je dois parcourir toutes les lignes.
        let l_startCell = 0  ;
        let l_lastCell = 0 ;
        let l_RowResume = 0 ;
        let l_RowIsResume = false ;
        for (let l_idxRow = 0; l_idxRow < this.m_nbRows; l_idxRow++) {
            // Calcul la premiere et derniere cellule a masquer pour chaque ligne
            l_startCell = p_startChannel + (this.m_nbCols * l_idxRow);
            l_lastCell = l_startCell + this.m_ChannelGroupeRange;
            //On verifie si la ligne est en mode resume
            // Calcul de la prochaine ligne en mode resume (index de la ligne / nombre de lignes par groupe) => index du groupe * nombre de canaux par groupe => canal de depart => +1 pour le suivant
            l_RowResume = (Math.floor( l_idxRow / this.m_ChannelGroupeRange) * this.m_ChannelGroupeRange) + 1;
            // console.log("l_RowIsResume", l_RowIsResume)
            if ( l_RowResume < this.m_nbRows) {
                l_RowIsResume = this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName][l_RowResume].style.display !== "";
            }else{
                l_RowIsResume = false ;
            }

            // Parcours toutes les cellules de l'interval pour verifier si elles sont bien remplies
            for (let l_idxCell = l_startCell; l_idxCell < l_lastCell; l_idxCell++) {
                this.updateCellDisplay(p_source, l_idxCell, l_startCell, l_RowIsResume, p_isResume);
            }

            // Masquer les cellules concernees sauf la premiere colonne qui sera nos cellules resumees
            for (let l_idxCell = l_startCell + 1; l_idxCell < l_lastCell; l_idxCell++) {
                this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][l_idxCell].style.display = p_isResume ? "none" : "";
            }
        }
    }

    foldRowsCells(p_source, p_startChannel, p_lastChannel, p_isResume) {
        // Prends l'index de premiere cellule de la colonne a masquer
        let l_startCell = p_startChannel * this.m_nbCols;
        // Prends l'index de la derniere cellule en bas de la derniere colonne a masquer
        let l_lastCell = l_startCell + (this.m_nbCols * this.m_ChannelGroupeRange);
        let l_colIndex = 0 ;
        let l_ResumeCellIndex = 0 ;
        let l_ColResume = 0 ;
        let l_ColIsResume = false ;
        // Boucle sur les cellules des lignes impactees
        for (let l_idxCell = l_startCell; l_idxCell < l_lastCell; l_idxCell++) {
            // Calcul de la colonne de la cellule
            l_colIndex = l_idxCell % this.m_nbCols;
            // Calcul de la cellule correspondante dans la premiere ligne
            l_ResumeCellIndex = l_colIndex + (this.m_nbCols * p_startChannel);
            // Calcul de la cellule next resume
            // Quand je plie la ligne, je dois verifier si la colonne suivante est pliee les colonnes
            l_ColResume = (Math.floor( l_colIndex / this.m_ChannelGroupeRange) * this.m_ChannelGroupeRange ) +1 ;
            // console.log("l_ColIsResume", l_ColIsResume)
            if ( l_ColResume < this.m_nbCols) {
                l_ColIsResume = this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName][l_ColResume].style.display !== "";
            }else{
                l_ColIsResume = false ;
            }
            // Verification si la cellule
            this.updateCellDisplay(p_source, l_idxCell, l_ResumeCellIndex,l_ColIsResume, p_isResume);
        }
    }

    updateCellDisplay(p_source, p_idxCell, p_CellResumeIndex, p_ColOrRowIsResume, p_isResume) {
        const l_CellResume = this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][p_CellResumeIndex];
        const l_Cell = this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][p_idxCell];
        const l_isFilled = l_Cell.textContent !== "";
        const l_idxMixer = Math.floor(p_idxCell / this.m_nbCols);
        const l_idxChannel = p_idxCell % this.m_nbCols;
        const l_trim = this.updateDataCell(p_source, l_idxMixer, l_idxChannel);
        const l_mute = this.updateDataCell(p_source, l_idxMixer, l_idxChannel);
        const l_haveAudio = !l_mute && l_trim !== this.m_minTrim;

        if ( l_isFilled || l_haveAudio) {
            if (p_isResume) {
                // On est en mode resume => on affiche le checkmark
                l_CellResume.textContent = "\u2714";
                l_CellResume.style.backgroundColor = "green";
            } else {
                if (!p_ColOrRowIsResume) {
                    // Cas particulier de la cellule a double usage la ligne ou la colonne est en mode non resume
                    if (l_Cell === l_CellResume) {
                        if (l_haveAudio) {
                            l_CellResume.textContent = l_trim;
                            l_CellResume.style.backgroundColor = "green";
                        } else {
                            l_CellResume.textContent = "";
                            l_CellResume.style.backgroundColor = "";
                        }
                    } else {
                        // On est en mode non masque et le canal est actif => on affiche le gain
                        if (l_haveAudio) {
                            l_Cell.textContent = l_trim;
                            l_Cell.style.backgroundColor = "green";
                        } else {
                            l_Cell.textContent = "";
                            l_Cell.style.backgroundColor = "";
                        }
                    }
                } else if (l_Cell === l_CellResume) {
                    if ( l_haveAudio ) {
                        // La ligne ou la colonne est en mode resume => on affiche la coche
                        l_CellResume.textContent = "\u2714";
                        l_CellResume.style.backgroundColor = "green";
                    } else {
                        l_Cell.textContent = "";
                        l_Cell.style.backgroundColor = "";
                    }
                }
            }
        }
    }

    //EventListeners
    addEventListeners() {
        // Click sur tout le document possible pour effacer l'input box
        document.addEventListener("click", p_event => {
            p_event.preventDefault();
            this.hideInputBox();
        });

        // Click en dehors de la fenêtre pour effacer l'input box
        window.addEventListener("blur", () => {
            this.hideInputBox();
        });

        // Déplacement de la souris sur les cellules pour afficher le surlignage et les gridInfos
        document.addEventListener("mousemove", p_event => {
            const l_cell = p_event.target;
            if (l_cell.classList.contains("cell")) {
                this.highlightAndGridInfos(l_cell);
            } else {
                this.clearCrossHair();
                this.clearGridInfos();
            }
        });

        // Double clic sur les cellules pour afficher l'input box
        this.m_matrixMixer.querySelectorAll(".cell").forEach((cell, p_cellIdx) => {
            cell.addEventListener("dblclick", p_event => {
                p_event.preventDefault();
                this.showInputBox(p_event, p_cellIdx);
            });
        });
    }

    //Surlignage & GridInfos
    highlightAndGridInfos(p_cell) {
        // Si inputBox présent : ne rien faire
        if (document.querySelector(".inputBox")) return;
        this.clearCrossHair();

        // Récupération des indices de ligne et de colonne de la cellule
        const p_row = parseInt(p_cell.getAttribute('data-row'));
        const p_col = parseInt(p_cell.getAttribute('data-col'));
        const l_nbCell = this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells].length;
        const l_nbCols = this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName].length;
        let colIdx = 0;
        let rowIdx = 0;

        // Parcours des lignes
        for (let l_idxRow = 0; l_idxRow < l_nbCell; l_idxRow++) {
            colIdx = l_idxRow % l_nbCols;
            rowIdx = Math.floor(l_idxRow / l_nbCols);

            // Surligner la colonne correspondante
            if (colIdx === p_col - 1) {
                this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][l_idxRow].classList.add('highlight');
                this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName][colIdx].classList.add('highlight');
            }

            // Surligner la ligne correspondante
            if (rowIdx === p_row - 1) {
                this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][l_idxRow].classList.add('highlight');
                this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName][rowIdx].classList.add('highlight');
            }

            // Afficher les informations de la grille pour la cellule correspondante
            if (colIdx === p_col - 1 && rowIdx === p_row - 1) {
                this.m_matrixMixer.appendChild(this.drawGridInfos(p_col, p_row, p_cell));
            }
        }
    }

    drawGridInfos(p_col, p_row, p_cell) {
        // Récupérer ou créer l'élément gridInfos
        let l_gridInfos = document.getElementById("gridInfos");

        if (!l_gridInfos) {
            l_gridInfos = document.createElement("div");
            l_gridInfos.id = "gridInfos";
            l_gridInfos.style.position = "absolute";
        }

        // Calcul de la position de l'élément gridInfos
        const l_rect = p_cell.getBoundingClientRect();
        const offset = 10;
        const additionalOffset = (p_col.toString().length - 1) * 2;
        l_gridInfos.style.left = `${l_rect.left + window.scrollX + offset - additionalOffset}px`;
        l_gridInfos.style.top = `${l_rect.top + window.scrollY + offset}px`;

        // Récupération des titres des colonnes et des lignes
        const colTitle = this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName][p_col - 1].childNodes[e_channelNameContent.alias].textContent;
        const rowTitle = this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName][p_row - 1].childNodes[e_channelNameContent.alias].textContent;
        l_gridInfos.innerHTML = `
        <div class="mixerGridInfos">${colTitle}</div>
        <div class="outputGridInfos">${rowTitle}</div>
    `;

        // Vérifier si l'élément est trop proche du bord supérieur ou gauche
        const isTooCloseToTop = l_rect.top < (20 * 21) + offset + additionalOffset; // 20px * 21 = 420px   //20px = taille de la cellule
        const isTooCloseToLeft = l_rect.left < (20 * 19) + offset + additionalOffset; // 20px * 19 = 380px   //20px = taille de la cellule


        // Masquer les informations si c'est trop proche du bord
        l_gridInfos.querySelector('.mixerGridInfos').style.display = isTooCloseToTop ? "none" : "block";
        l_gridInfos.querySelector('.outputGridInfos').style.display = isTooCloseToLeft ? "none" : "block";

        return l_gridInfos;
    }

    clearCrossHair() {
        const l_gridCells = this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells];
        const l_rowChannelName = this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName];
        const l_colChannelName = this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName];

        l_gridCells.forEach(cell => cell.classList.remove('highlight'));
        l_rowChannelName.forEach(header => header.classList.remove('highlight'));
        l_colChannelName.forEach(header => header.classList.remove('highlight'));
    }

    clearGridInfos() {
        const l_gridInfos = document.getElementById("gridInfos");
        if (l_gridInfos) {
            l_gridInfos.remove();
        }
    }

    //InputBox
    showInputBox(p_event, p_cellIdx) {
        if (document.querySelector(".inputBox")) this.hideInputBox();
        // Récupération de la cellule
        const l_cell = p_event.target;
        if (l_cell.textContent === "\u2714") return; // Si la cellule est un checkmark, ne rien faire
        // Creation de l'input box
        const l_inputBox = document.createElement("input");
        l_inputBox.classList.add("inputBox", "crossWidth", "crossHeight");
        l_inputBox.type = "text";
        if (l_cell.textContent !== "") {
            l_inputBox.value = l_cell.textContent;
        } else {
            l_inputBox.value = "-";
        }

        // Positionnement de l'input box
        const rect = l_cell.getBoundingClientRect();
        l_inputBox.style.left = `${rect.left + window.scrollX - 2}px`;
        l_inputBox.style.top = `${rect.top + window.scrollY - 2}px`;

        //Gestion des évènements
        this.handleInputBoxKeyDown( p_cellIdx, l_inputBox);

        // Ajout de l'input box au DOM et focus
        this.m_matrixMixer.appendChild(l_inputBox);
        l_inputBox.focus();
    }

    hideInputBox() {
        const l_inputBox = document.querySelector(".inputBox");
        if (l_inputBox) {
            const l_cell = l_inputBox.parentElement;
            if (l_inputBox.value) {
                l_cell.style.backgroundColor = "";
            }
            if (l_inputBox.parentNode) {
                l_inputBox.remove();
            }
        }
    }

    handleInputBoxKeyDown(p_cellIndex, p_inputBox) {
        const l_channelIdx = p_cellIndex % this.m_nbCols;
        const l_mixerIdx = Math.floor(p_cellIndex / this.m_nbCols);
        const l_minGain =  this.m_minTrim;
        const l_maxGain = this.m_maxTrim;
        let l_keyPressCount = 0;
        let l_previousValue = p_inputBox.value;

        //Gestion des évènements
        p_inputBox.addEventListener("keydown", (p_event) => {
            l_keyPressCount++;
            if (l_keyPressCount === 1) {
                p_inputBox.value = this.handleFirstKeyPress(p_event.key);
                p_event.preventDefault();
            }
            let l_value = parseFloat(p_inputBox.value);
            switch (p_event.key) {
                case "Enter":
                    this.handleEnterKey(this.m_AudioWayMixerInput, l_mixerIdx, l_channelIdx, l_value, l_minGain, l_maxGain, p_inputBox, p_cellIndex, l_previousValue);
                    break;
                case "Tab":
                    this.handleTabKey(this.m_AudioWayMixerInput, l_mixerIdx, l_channelIdx, l_value, l_minGain, p_inputBox, p_cellIndex, l_previousValue);
                    p_event.preventDefault();
                    break;
                case "Escape":
                    p_event.preventDefault();
                    this.hideInputBox();
                    break;
                case "ArrowLeft":
                case "ArrowRight":
                case "ArrowUp":
                case "ArrowDown":
                case "Delete":
                    p_inputBox.value = "";
                    l_keyPressCount = 0;
                    break
                case "Backspace":
                    p_inputBox.value = "";
                    l_keyPressCount = 0;
                    break;
                default:
                    if (!/^[0-9.\-]$/.test(p_event.key)) {
                        p_event.preventDefault();
                    }
                    break;
            }
        });
    }

    handleFirstKeyPress(inputValue) {
        if (inputValue === "+") {
            return "+";
        }
        if ((inputValue !== "-") && (inputValue !== "+")) {
                return "-" + inputValue.replace(/\D/g, '');
        }
        return inputValue.replace(/\D/g, '');
    }

    handleEnterKey(p_audioWay, p_mixerIdx, p_channelIdx, p_value, p_minGain, p_maxGain, p_inputBox, p_cellIndex, p_previousValue) {
        // p_value = Math.max(p_minGain, Math.min(p_value, p_maxGain));
        if (isNaN(p_value)) {
            p_inputBox.value = p_previousValue;
            return;
        }
        this.drawNewValueOnGrid(p_cellIndex, p_value, p_minGain);
        this.hideInputBox();
        this.selectNextDiagonalCell(p_cellIndex);
    }

    handleTabKey(p_audioWay, p_mixerIdx, p_channelIdx, p_value, p_minGain, p_inputBox, p_cellIndex, p_previousValue) {
        if (isNaN(p_value)) {
            p_inputBox.value = p_previousValue;
        } else {
            this.drawNewValueOnGrid(p_cellIndex, p_value, p_minGain);

        }
        this.selectNextCell(p_cellIndex).focus();
    }

    drawNewValueOnGrid(p_cellIndex, p_value, p_minGain) {
        let l_cell = this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][p_cellIndex];
        if (p_value !== null && p_value > p_minGain) {
            l_cell.textContent = p_value;
            l_cell.style.backgroundColor = "green";
            // Démarrer ou arrêter l'animation du VuMeter si une valeur est présente
            this.toggleVuMeterAnimation(l_cell, p_cellIndex);
        } else if (p_value <= p_minGain) {
            l_cell.textContent = "";
            l_cell.style.backgroundColor = "";
            this.toggleVuMeterAnimation(l_cell, p_cellIndex);
        }
    }

    updateDataCell(p_inputBox, p_cellIndex) {
        let l_cell = this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][p_cellIndex];
        const newValue = p_inputBox.value;
        if (newValue !== "") {
            l_cell.textContent = newValue;
        }
        return newValue
    }

    selectNextCell(p_channelIdx) {
        const l_nbCells = this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells].length;
        const l_nextCellIdx = (p_channelIdx + 1) % l_nbCells;
        const l_nextCell = this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][l_nextCellIdx];

        if (l_nextCell) {
            const p_event = new Event('dblclick');
            l_nextCell.dispatchEvent(p_event);
        }
        return l_nextCell;
    }

    selectNextDiagonalCell(p_channelIdx) {
        const l_nextDiagonalCellIdx = p_channelIdx + this.m_nbCols + 1;
        const l_nextDiagonalCell = this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][l_nextDiagonalCellIdx];

        if (l_nextDiagonalCell){
            const p_event = new Event('dblclick');
            l_nextDiagonalCell.dispatchEvent(p_event);
        }
        return l_nextDiagonalCell;
    }

    
    toggleVuMeterAnimation(p_cell, p_cellIndex) {
        if (p_cell.textContent) {
            this.startVuMeterAnimation(p_cellIndex);
        } else {
            this.stopVuMeterAnimation(p_cellIndex);
        }
    }
    
    startVuMeterAnimation(p_cellIndex) {
        const l_audioSourcesVuMeter = this.getVuMeter(p_cellIndex, true);
        const l_audioReceiverVuMeter = this.getVuMeter(p_cellIndex, false);

        this.animateVuMeter(l_audioSourcesVuMeter);
        this.animateVuMeter(l_audioReceiverVuMeter);
    }

    stopVuMeterAnimation(p_cellIndex) {
        const l_colIndex = p_cellIndex % this.m_nbCols;
        const l_rowIndex = Math.floor(p_cellIndex / this.m_nbCols);
        const l_audioSourcesVuMeter = this.getVuMeter(p_cellIndex, true);
        const l_audioReceiverVuMeter = this.getVuMeter(p_cellIndex, false);

        if (!this.isRowFilled(l_rowIndex)) {
            this.stopAnimation(l_audioReceiverVuMeter,l_colIndex,l_rowIndex);
        }
        if (!this.isColFilled(l_colIndex)) {
            this.stopAnimation(l_audioSourcesVuMeter,l_colIndex,l_rowIndex);
        }
    }

    getVuMeter(p_cellIndex, p_source) {
        const l_index = p_source ? p_cellIndex % this.m_nbCols : Math.floor(p_cellIndex / this.m_nbCols);
        const component = p_source ? e_matrixMixerComponents.AudioSources : e_matrixMixerComponents.AudioReceiver;
        return this.m_matrixMixerData[component][e_matrixMixerHeaders.channelName][l_index].childNodes[e_channelNameContent.vuMeter];
    }

    animateVuMeter(p_canvas) {
        const l_vuMeterContext = p_canvas.getContext("2d");

        const animate = () => {
            const newValue = Math.random() * 100;
            l_vuMeterContext.clearRect(0, 0, p_canvas.width, p_canvas.height);
            l_vuMeterContext.fillRect(0, p_canvas.height - (newValue / 100) * p_canvas.height, p_canvas.width, (newValue / 100) * p_canvas.height);
            p_canvas.animationTimeoutId = setTimeout(animate, 300);
        };

        animate();
    }

    stopAnimation(p_canvas,p_colIndex,p_rowIndex) {
        if (p_canvas.animationTimeoutId) {
            clearTimeout(p_canvas.animationTimeoutId);
            delete p_canvas.animationTimeoutId;
        }
        const l_vuMeterContext = p_canvas.getContext("2d");
        l_vuMeterContext.clearRect(0, 0, p_canvas.width, p_canvas.height);
        p_canvas.remove();

        const newCanvas = this.fctDrawChannelVuMeter(p_canvas.classList.contains("colVuMeterMatrixMixerCanvas"));
        const parent = p_canvas.classList.contains("colVuMeterMatrixMixerCanvas") ?
            this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName][p_colIndex] :
            this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName][p_rowIndex];
        parent.insertBefore(newCanvas, parent.childNodes[e_channelNameContent.alias].nextSibling);
    }

    isRowFilled(p_rowIndex) {
        for (let idxCols = 0; idxCols < this.m_nbCols; idxCols++) {
            if (this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][p_rowIndex * this.m_nbCols + idxCols].textContent) {
                return true;
            }
        }
    }

    isColFilled(p_colIndex) {
        for (let idxRows = 0; idxRows < this.m_nbRows; idxRows++) {
            if (this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][idxRows * this.m_nbCols + p_colIndex].textContent) {
                return true;
            }
        }
        return false;
    }
}

function createGridMatrix(p_containerSelector,) {
    return new gridMatrix(p_containerSelector);
}


createGridMatrix("matrixMixer");

/*
    +-----------------------------------------------+-------------------------------------------------------------------------------------------------------------+
    | EmptyContainer                                |     e_matrixMixerComponents.AudioSources                                                                    |
    |                                               |  +----------------------------------------------------------------------------------------------------------+
    |                                               |  |       e_matrixMixerHeaders.cardName                                                                      |
    |                                               |  | +--------------------------------------+------------------+------------------------------------------+---|
    |                                               |  | | e_matrixMixerHeaders.channelGroupe   |                  |                                          |   |
    |                                               |  | | +-------------+  +-------------+     |                  |                                          |   |
    |                                               |  | | | channelName |  | channelName |     |                  |                                          |   |
    |                                               |  | | +-------------+  +-------------+     |                  |                                          |   |
    |                                               |  | +--------------------------------------+------------------+------------------------------------------+---|
    |                                               |  +----------------------------------------------------------------------------------------------------------+
    |                                               |                                                                                                             |
    +-----------------------------------------------+-------------------------------------------------------------------------------------------------------------+
    |   e_matrixMixerComponents                     |  e_matrixMixerComponents.mixDisplay                                                                         |
    |   AudioReceiver                               |  +-------------------------------------------------------------------------------------------------+        |
    |                                               |  | e_matrixMixerCells.cells                                                                        |        |
    |                                               |  | +--------------------+  +--------------------+ +-----+                                          |        |
    |                                               |  | | e_matrixMixerCells |  | e_matrixMixerCells | | ... |                                          |        |
    |                                               |  | | cellSimple         |  | cellSimple         | |     |                                          |        |
    |                                               |  | +--------------------+  +--------------------+ +-----+                                          |        |
    |                                               |  +-------------------------------------------------------------------------------------------------+        |
    +-----------------------------------------------+-------------------------------------------------------------------------------------------------------------+
*/