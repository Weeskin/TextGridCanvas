"use strict"
/*
    +---------------------------+-------------------------------------------------------------------------------------------------------------+
    |                                          |     e_matrixMixerComponents.AudioSources                                                                                                |
    |                                          |  +-----------------------------------------------------------------------------------------------------+       |
|                                              |  |       e_matrixMixerHeaders.cardName                                                                                               |       |
    |                                          |  | +------------------------------------+----------------------------------------------------+ +---+-----|   |
    |                                          |  | | e_matrixMixerHeaders.channelGroupe |                                                                         | |  ...  | ...     ||  |
    |                                          |  | | +-------------+  +-------------+   |                                                                                 | |       |         ||  |
    |                                          |  | | | channelName |  | channelName   |   |                                                                               | |       |         ||  |
    |                                          |  | | +-------------+  +-------------+   |                                                                                  | |       |         ||  |
    |                                          |  | +------------------------------------+-----------------------------------------+ +-------+---------------+|  |
    |                                          |  +--------------------------------------------------------------------------------------------------------+  |
    |                                          |                                                                                                                                                                    |
    |                                          |  +--------------------------------------------------------------------------------------------------------+  |
    |                                          |  |                          e_matrixMixerHeaders.channelType                                                                         |  |
    |                                          |  +--------------------------------------------------------------------------------------------------------+  |
    +---------------------------+--------------------------------------------------------------------------------------------------------------+
    |   e_matrixMixerComponents |  e_matrixMixerComponents.mixDisplay                                                                                                      |
    |   AudioReceiver                     |   +-----------------------------------------------------------------------------------------------------+ +
    |                                                |  | e_matrixMixerCells.cells                                                                                                                   | |
    |                                                |  | +--------------------+  +--------------------+ +-----+ +--------------------+                                 | |
    |                                                |  | | e_matrixMixerCells |  | e_matrixMixerCells | | ... | | e_matrixMixerCells         |                                  | |
    |                                                |  | | cellSimple               |  | cellSimple               | |     | | cellResumes                  |                                  | |
    |                                                |  | +--------------------+  +--------------------+ +-----+ +--------------------+                                 | |
    |                                                |  +-----------------------------------------------------------------------------------------------------+ |
    +-------------------------------+----------------------------------------------------------------------------------------------------------+
*/

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

//Énum pour spécifier les deux div (alias et vuMeter) au sein de ChannelName lié à l'appel de la fonction childNodes
const e_channelNameContent = {
    alias : 0 ,
    vuMeter : 1,
    last : 2
};


class gridMatrix {
    constructor(p_containerSelector) {
        this.m_ChannelGroupeRange = 8 ;
        this.m_nbCards = 1 ;
        this.m_nbCols = 64;
        this.m_nbRows = 64
        this.m_matrixMixer = document.getElementById(p_containerSelector);
        this.m_matrixMixerData = new Array(e_matrixMixerComponents.last);
        // this.m_AudioWay = e_AudioWay.input;
        this.m_AudioWay = 0;
        this.m_AudioWayMixerInput = 1
        // Save trim min only channel zero , all the same .
        // this.m_minTrim = g_Gui.getDevice().getMixerChanGainMin (e_AudioWay.mixerInput , 0 , 0 );
        this.m_minTrim = -80.1
        // this.m_matrixMixerControl = g_Gui.getMixerControl();
        this.m_cardAlias = ["ADSP-Pierre"]
        this.m_nbCards = this.m_cardAlias.length;


        this.init(this.m_nbCards, this.m_AudioWay, this.m_nbCols);
    }
    // updateMatrixMixerCardName(p_cardIdx) {
    //     //Récupération des noms de cartes
    //     const l_cardAlias = this.m_cardAlias
    //
    //     const audioSourcesCardName = this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.cardName];
    //     const audioReceiverCardName = this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.cardName];
    //
    //     if (audioSourcesCardName.length > p_cardIdx && audioSourcesCardName[p_cardIdx].childNodes.length > e_channelNameContent.alias) {
    //         audioSourcesCardName[p_cardIdx].childNodes[e_channelNameContent.alias].textContent = l_cardAlias;
    //     }
    //     if (audioReceiverCardName.length > p_cardIdx && audioReceiverCardName[p_cardIdx].childNodes.length > e_channelNameContent.alias) {
    //         audioReceiverCardName[p_cardIdx].childNodes[e_channelNameContent.alias].textContent = l_cardAlias;
    //     }
    // }
    //
    // updateMatrixMixerChannelName(p_audioWay, p_channelIdx) {
    //     // Récupération des noms de canaux
    //     const l_channelAlias = ["Mic Yves", "Mic Pierre", "Test3", "Mic toto", "Input 5",  "Input 6", "Input 7",  "Input 8","Input 9", "Input 10", "Test 2", "Input 12",  "Input 13",
    //         "Input 14", "Input 15", "Input 16","Input 17","Input 18",  "Input 19","Input 20",  "Input 21",  "Input 22",   "Input 23", "Input 24",  "Input 25","Input 26", "Input 27",
    //         "Input 28",  "Input 29",  "Input 30",  "Input 31",  "Input 32",  "Input 33",  "Input 34",  "Input 35",  "Input 36",  "Input 37",  "Input 38",   "Input 39",
    //         "Input 40","Input 41","Input 42","Input 43","Input 44","Input 45","Input 46","Input 47","Input 48","Input 49","Input 50","Input 51","Input 52", "Input 53",
    //         "Input 54","Input 55", "Input 56", "Input 58", "Input 59", "Input 60", "Input 61", "Input 62", "Input 63", "Input 64",
    //         "Salle A",
    //         "Salle r2",
    //         "Mixer 4",
    //         "Test out"]
    //     let l_matrixMixerData = this.m_matrixMixerData[(p_audioWay === this.m_AudioWay) ? e_matrixMixerComponents.AudioSources : e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName];
    //     if (l_matrixMixerData.length > p_channelIdx && l_matrixMixerData[p_channelIdx].childNodes.length > e_channelNameContent.alias) {
    //         l_matrixMixerData[p_channelIdx].childNodes[e_channelNameContent.alias].textContent = l_channelAlias;
    //     }
    // }


    init(p_nbCards, p_audioWay, p_nbCols) {
        console.log(this.m_matrixMixerData);
        this.initAnEmptyMatrixMixerData();
        // this.updateMatrixMixerCardName(p_nbCards);
        // this.updateMatrixMixerChannelName(p_audioWay, p_nbCols);
        // Création des deux div Columns et Rows l'une sur l'autre
        this.createMixerDataHeaders(true, );
        this.createMixerDataHeaders(false, );

        this.addEventListeners();
    }

    initAnEmptyMatrixMixerData(){
        //Initialisation de tableau vide pour chaque carte
        for ( let l_mixerComponentIdx = 0 ; l_mixerComponentIdx < e_matrixMixerComponents.last ; l_mixerComponentIdx ++){
            this.m_matrixMixerData[l_mixerComponentIdx] = [];
            switch(l_mixerComponentIdx){
                case e_matrixMixerComponents.AudioSources:
                case e_matrixMixerComponents.AudioReceiver:
                    for ( let l_MixerHeadersIdx = 0 ; l_MixerHeadersIdx < e_matrixMixerHeaders.last ; l_MixerHeadersIdx ++  ){
                        this.m_matrixMixerData[l_mixerComponentIdx][l_MixerHeadersIdx] = [];
                    }
                    break;
                case e_matrixMixerComponents.mixDisplay:
                    for (let l_mixerCellsIdx = 0 ; l_mixerCellsIdx < e_matrixMixerCells.last ; l_mixerCellsIdx ++) {
                        this.m_matrixMixerData[l_mixerComponentIdx][l_mixerCellsIdx] = [];
                    }
                    break;
                default:
                    break;
            }
        }
    }

    initAnEmptyContainer() {
        //Création container en haut à gauche vide
        let l_emptyContainer = document.createElement("div");
        l_emptyContainer.classList.add("emptyContainer");
        return l_emptyContainer
    }

    createMixerDataHeaders(p_source) {
        // Traitement des sources input = colonnes ou output = lignes
        const l_matrixMixerData = this.m_matrixMixerData[p_source ? e_matrixMixerComponents.AudioSources : e_matrixMixerComponents.AudioReceiver];
        const l_nbChannels = p_source ? this.m_nbCols : this.m_nbRows;
        const l_tbxOfIntervals = this.getIntervals(l_nbChannels, this.m_ChannelGroupeRange);
        const l_divHeaderContainer = document.createElement("div");
        l_divHeaderContainer.classList.add(`${p_source ? "columns" : "rows"}Container`);

        if (p_source) {
            l_divHeaderContainer.appendChild(this.initAnEmptyContainer());
        }

        // Parcours des cards
        for (let l_cardIdx = 0; l_cardIdx < this.m_nbCards; l_cardIdx++) {
            // Ajout des en-têtes (colonne ou ligne) pour chaque carte
            if (this.fctDrawHeaderContainer) {
                let l_fctDrawHeaderContainer = this.fctDrawHeaderContainer(p_source, l_cardIdx);
                l_matrixMixerData[e_matrixMixerHeaders.cardName].push(l_fctDrawHeaderContainer);
                l_divHeaderContainer.appendChild(l_fctDrawHeaderContainer);

                // Création d'une div pour rassembler les noms des intervals pour pouvoir les mettre en lignes ou en colonnes
                let l_channelsGroups = document.createElement("div");
                l_channelsGroups.classList.add(`divForAll${p_source ? "Col" : "Row"}ChannelsGroups`);
                l_fctDrawHeaderContainer.appendChild(l_channelsGroups);

                for (let l_IdxGrp = 0; l_IdxGrp < l_tbxOfIntervals.length; l_IdxGrp++) {  // ! \\ l_tbxOfIntervals basé sur this.m_ChannelGroupeRange = 8
                    //Création des noms des intervals
                    let l_fctDrawChannelGroups = this.fctDrawChannelGroups(p_source, l_cardIdx, l_tbxOfIntervals[l_IdxGrp], l_IdxGrp);
                    l_matrixMixerData[e_matrixMixerHeaders.channelGroupe].push(l_fctDrawChannelGroups);
                    l_channelsGroups.appendChild(l_fctDrawChannelGroups);

                    // Création d'une div pour rassembler les noms des canaux pour pouvoir les mettre en lignes ou en colonnes
                    let l_channelsNames = document.createElement("div");
                    l_channelsNames.classList.add(`divForAll${p_source ? "Col" : "Row"}ChannelsNames`);
                    l_fctDrawChannelGroups.appendChild(l_channelsNames);

                    for (let l_idxChannel = l_IdxGrp * this.m_ChannelGroupeRange; l_idxChannel < ((l_IdxGrp + 1) * this.m_ChannelGroupeRange); l_idxChannel++) {
                        // Création des noms de canaux
                        let l_fctDrawChannelName = this.fctDrawChannelName(p_source, l_idxChannel);
                        l_matrixMixerData[e_matrixMixerHeaders.channelName].push(l_fctDrawChannelName);
                        l_channelsNames.appendChild(l_fctDrawChannelName);

                        //Création des cellules par ligne
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

    fctDrawHeaderContainer(p_source, p_cardIdx) {
        // Main div
        let l_cardNameElement = document.createElement("div");
        l_cardNameElement.classList.add(`${p_source?"col":"row"}CardName${p_cardIdx}`);
        // Title Div
        let l_cardTitleElement = document.createElement("div");
        l_cardTitleElement.classList.add(`${p_source?"col":"row"}CardTitle`);
        l_cardTitleElement.textContent = p_cardIdx +1;

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
        l_groupTitleElement.appendChild(this.createMinusPlusBtn(p_cardIdx , p_source , p_idxInterval));

        l_groupNameElement.appendChild(l_groupTitleElement);
        return l_groupNameElement;
    }

    fctDrawChannelName(p_source, p_channelIdx){
        // Main div
        let l_channelElement = document.createElement("div");
        l_channelElement.classList.add(`${p_source ?"col":"row"}ChannelName`);
        l_channelElement.classList.add(`cross${p_source?"Width":"Height"}`);

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

        return l_channelElement;
    }

    fctDrawChannelVuMeter(p_source) {
        //Création du vuMeter en canvas
        let l_vuMeterCanvas = document.createElement("canvas");
        l_vuMeterCanvas.classList.add(`${p_source ? "col" : "row"}VuMeterMatrixMixerCanvas`);
        let l_VuMeterContext = l_vuMeterCanvas.getContext("2d");
        let l_gradient = l_VuMeterContext.createLinearGradient(0, 0, 20, 20);
        l_gradient.addColorStop(1, "red");
        l_gradient.addColorStop(0.6, "yellow");
        l_gradient.addColorStop(0.3, "yellow");
        l_gradient.addColorStop(0, "green");
        l_VuMeterContext.fillStyle = l_gradient;

        //Ouverture des configurations au click sur le vuMeter
        // l_vuMeterCanvas.addEventListener('mousedown', function () {
        //     if (g_Gui.getConfigWindows()) {
        //         openConfigWindow();
        //         g_Gui.getConfigWindows().openConfigByName(GUI_SPECIFIC_TEMPLATE_IHM);
        //     }
        // });

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
        // // Debug
        // if ( p_colsIdx === p_rowsIdx ){
        //     l_cells.innerHTML = `${(p_colsIdx/this.m_ChannelGroupeRange)}`;
        // }
        return l_cells;
    }

    //Toggle Minus Plus Button
    createMinusPlusBtn(p_source, p_cardIdx, p_idxInterval) {
        const l_btn = document.createElement("button");
        l_btn.textContent = "-";
        l_btn.classList.add(`minus-btn`);
        l_btn.classList.add(`crossWidth`);
        l_btn.classList.add(`crossHeight`);
        l_btn.addEventListener('mousedown', () => { this.OnMouseDownMinusButton(p_cardIdx, p_source, p_idxInterval); });
        return l_btn;
    }

    OnMouseDownMinusButton(p_source, p_cardIdx, p_idxInterval ){
        // On met à display none toutes les colonnes ou lignes selon la source.
        let l_matrixHeaderCtx = p_source ? this.m_matrixMixerData[e_matrixMixerComponents.AudioSources] : this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver] ;
        // On laisse visible le premier pour la vue 'resume'
        let l_startChannel = p_idxInterval * this.m_ChannelGroupeRange ;
        let l_lastChannel = l_startChannel + this.m_ChannelGroupeRange ;
        let l_isResume = l_matrixHeaderCtx[e_matrixMixerHeaders.channelName][l_startChannel+1].style.display === "" ;

        // Mise à jour div channelName
        // l_matrixHeaderCtx[e_matrixMixerHeaders.channelName][l_startChannel].innerHTML = l_isResume ? (l_startChannel+1)+"-"+(l_lastChannel) : (l_startChannel+1) ;
        for ( let l_idxChannelName =  l_startChannel +1 ; l_idxChannelName < l_lastChannel ; l_idxChannelName++ ){
            l_matrixHeaderCtx[e_matrixMixerHeaders.channelName][l_idxChannelName].style.display = l_isResume ? "none" : "" ;
        }

        if (p_source) {
            // Calcul du nombre de lignes à masquer
            let l_nbCell = this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells].length;
            // Calcul du nombre de cellules par ligne
            let l_nbCols = this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName].length;
            let l_startCell = 0 ;
            let l_lastCell = 0 ;
            for ( let l_idxRow = 0 ; l_idxRow < l_nbCell ; l_idxRow++){
                // Calcul la premiere cellule à masquer et la dernière
                if ( l_idxRow % l_nbCols === 0 ) {
                    l_startCell = (l_startChannel) + ( l_nbCols * (l_idxRow / l_nbCols));
                    l_lastCell = l_startCell + this.m_ChannelGroupeRange;
                }
                if ( l_idxRow > l_startCell && l_idxRow < l_lastCell ){
                    this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][l_idxRow].style.display = l_isResume ? "none" : "" ;
                }
            }
        }
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

    //EventListeners
    addEventListeners() {
        // Click sur tout le document possible pour effacer l'input box
        document.addEventListener("click", p_event => {
            p_event.preventDefault();
            this.clearInputBox();
        });

        // Click en dehors de la fenêtre pour effacer l'input box
        window.addEventListener("blur", () => {
            this.clearInputBox();
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
        const isTooCloseToTop = l_rect.top < (20 * 19) + offset + additionalOffset; // 20px * 19 = 380px   //20px = taille de la cellule
        const isTooCloseToLeft = l_rect.left < (20 * 15) + offset + additionalOffset; // 20px * 15 = 300px   //20px = taille de la cellule

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
        // Récupération de la cellule
        const l_cell = p_event.target;

        // Création de l'input box
        const l_inputBox = document.createElement("input");
        l_inputBox.classList.add("inputBox", "crossWidth", "crossHeight");
        // l_inputBox.type = "number";


        // Positionnement de l'input box
        const rect = l_cell.getBoundingClientRect();
        l_inputBox.style.left = `${rect.left + window.scrollX - 2}px`;
        l_inputBox.style.top = `${rect.top + window.scrollY - 2}px`;

        //Gestion des évènements
        this.inputBoxKeyDown(l_cell, p_cellIdx, l_inputBox);

        // Ajout de l'input box au DOM et focus
        this.m_matrixMixer.appendChild(l_inputBox);
        l_inputBox.focus();
    }

    inputBoxKeyDown(p_cell, p_cellIndex, p_inputBox) {
        const l_mixerIdx = Math.floor(p_cellIndex / this.m_nbCols);
        const l_minGain = this.getMixerMatrixGainMin(p_cellIndex);
        const l_maxGain = this.getMixerMatrixGainMax(p_cellIndex);
        const l_audioWay = this.m_AudioWay
        let l_mute = true;

        //Gestion des évènements
        p_inputBox.addEventListener("keydown", (p_event) => {
            let l_value = parseFloat(p_inputBox.value);
            let l_keyboardValue = p_event.key;

            switch (l_keyboardValue) {
                case "Enter":
                    //Saisie la valeur dans la cellule si elle est valide
                    if (p_inputBox.value.trim() === "") {
                        p_cell.textContent = "";
                        p_cell.style.backgroundColor = "";
                        this.stopVuMeterAnimation(p_cellIndex);
                        this.clearInputBox();
                    } else if (l_value >= l_minGain && l_value <= l_maxGain) {
                        l_mute = false;
                        // this.refreshModelFromMixerValue(l_audioWay, l_mixerIdx, p_cellIndex, l_value, l_mute);
                        this.drawNewValueOnGrid(p_cellIndex, l_value);
                        this.clearInputBox();
                    } else {
                        alert(`La valeur doit être entre ${l_minGain} et ${l_maxGain}`);
                        p_inputBox.focus();
                    }
                    break;
                //Todo :  à revoir
                case "Tab":
                    p_event.preventDefault();
                    p_event.stopImmediatePropagation();
                    // Saisie la valeur dans la cellule
                    // this.refreshModelFromMixerValue(l_audioWay, l_mixerIdx, p_cellIndex, l_value, l_mute);
                    this.drawNewValueOnGrid(p_cellIndex, l_value);
                    // Efface l'input box
                    this.clearInputBox();
                    // Passe à la cellule suivante
                    // this.selectNextCell(p_cellIndex);
                    break;
                case "Escape":
                    // Efface et annule la saisie
                    this.clearInputBox();
                    break;
                case "Backspace":
                case "ArrowLeft":
                case "ArrowRight":
                case "ArrowUp":
                case "ArrowDown":
                case "Delete":
                    break;
                default:
                    if ((l_keyboardValue < "0" || l_keyboardValue > "9") && l_keyboardValue !== "." && l_keyboardValue !== "-") {
                        p_event.preventDefault();
                        p_event.stopImmediatePropagation();
                    }
                    break;
            }
        });
    }

    drawNewValueOnGrid(p_cellIndex, p_value) {
        //Contenu de la cellule
        let l_cell = this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][p_cellIndex];
        l_cell.textContent = p_value;
        //Color et Header
        this.updateColorCellAndHeader(l_cell,p_cellIndex);
    }

    // selectNextCell(p_cellIdx) {
    //     const l_nbCells = this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells].length;
    //     const l_nextCellIdx = (p_cellIdx + 1) % l_nbCells;
    //     const l_nextCell = this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][l_nextCellIdx];
    //
    //     let p_event = l_nextCell.event
    //     this.showInputBox(p_event,l_nextCellIdx);
    //
    //     // Append the input box to the next cell and focus on it
    //     this.m_matrixMixer.appendChild(l_inputBox);
    //     l_inputBox.focus();
    //
    //     return l_nextCell;
    // }

    getMixerMatrixGainMin () {
        // let l_channelIdx = p_cellIndex % this.m_nbCols;
        // if (g_Gui.getDevice().isAVWallDTxI() && this.m_AudioWay === e_AudioWay.input && g_Gui.getInterfaceMode() === e_GuiMode.GuiModeEasy && g_Gui.getMixerControl()) {
        //     // Special case DT4I : AVDT4I gain -12 / +64 , user want +64 / -81 =>  ! pb ! ==> Using mixer on easy mode => input +64 / -81
        //     l_minGain = g_Gui.getDevice().getMixerChanGainMin(e_AudioWay.mixerInput, g_Gui.getMixerControl().getCurrentMixer(), l_channelIdx);
        // }
        return this.m_minTrim;
    }

    getMixerMatrixGainMax () {
        // let l_channelIdx = p_cellIndex % this.m_nbCols;
        return 12
    }

    // setGainValueFromMatrixMixer(p_AudioWay, p_mixerIdx, p_chanIdx, p_gainValue) {
    //     let l_device = this.m_cardAlias
    //     if (p_gainValue !== undefined) {
    //         if (!isNaN(p_gainValue)) {
    //             //Mise à jour au niveau du model
    //             // l_device.setMixerChanGain(p_AudioWay, p_mixerIdx, p_chanIdx, p_gainValue);
    //             //Mise à jour de la vue Slice
    //             // if (  this.m_matrixMixerControl  &&   this.m_matrixMixerControl .getCurrentMixer() === p_mixerIdx) {
    //             //     this.m_matrixMixerControl .getMixerSlices()[p_chanIdx].m_faderViewmeter.goToValue(p_gainValue);
    //             // }
    //         }
    //     }
    // }
    //
    // setMuteValueFromMatrixMixer(p_AudioWay, p_mixerIdx, p_chanIdx, p_mute) {
    //     if (p_mute !== undefined) {
    //         g_Gui.getDevice().setMixerChanMute(p_AudioWay, p_mixerIdx, p_chanIdx, p_mute);
    //     }
    // }
    //
    // refreshMixerValuesFromModel(p_audioWay, p_mixerIdx, p_sliceIdx) {
    //     let l_device = g_Gui.getDevice();
    //     const l_cellIndex= p_mixerIdx * this.m_nbCols + p_sliceIdx;
    //     const l_mute = l_device.getMixerChanMute(p_audioWay, p_mixerIdx, p_sliceIdx);
    //     const l_trim = l_device.getMixerChanGain(p_audioWay, p_mixerIdx, p_sliceIdx);
    //     const cell = this.m_matrixMixerData[e_matrixMixerComponents.mixDisplay][e_matrixMixerCells.cells][l_cellIndex];
    //
    //     if (l_trim > this.m_minTrim && !l_mute) {
    //         cell.textContent = l_trim;
    //         this.updateColorCellAndHeader(cell,l_cellIndex)
    //     } else {
    //         cell.textContent = "";
    //         cell.style.backgroundColor = "";
    //     }
    // }

    updateColorCellAndHeader(p_cell, p_cellIndex) {
        // Définir la couleur des entêtes correspondant à la cellule
        p_cell.style.backgroundColor = "green";
        const l_colIndex = p_cellIndex % this.m_nbCols;
        const l_rowIndex = Math.floor(p_cellIndex / this.m_nbCols);

        // Mise à jour de la couleur des alias en fonction de l'état de remplissage des lignes et des colonnes
        this.updateAliasColor(l_colIndex, l_rowIndex);
        // Démarrer ou arrêter l'animation du VuMeter si une valeur est présente
        this.toggleVuMeterAnimation(p_cell, p_cellIndex);
    }
    updateAliasColor(l_colIndex, l_rowIndex) {
        const l_audioSourcesAlias = this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName][l_colIndex].childNodes[e_channelNameContent.alias];
        const l_audioReceiverAlias = this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName][l_rowIndex].childNodes[e_channelNameContent.alias];

        l_audioSourcesAlias.style.color = this.isColFilled(l_colIndex) ? "#FFFFB4bb" : "";
        l_audioReceiverAlias.style.color = this.isRowFilled(l_rowIndex) ? "#FFFFB4bb" : "";
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
            this.updateAliasColor(l_colIndex, l_rowIndex);
        }
        if (!this.isColFilled(l_colIndex)) {
            this.stopAnimation(l_audioSourcesVuMeter,l_colIndex,l_rowIndex);
            this.updateAliasColor(l_colIndex, l_rowIndex);
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
            l_vuMeterContext.fillRect(0, 0, (newValue / 100) * p_canvas.width, p_canvas.height);
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


    clearInputBox() {
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
}

function createGridMatrix(p_containerSelector,) {
    return new gridMatrix(p_containerSelector);
}


createGridMatrix("matrixMixer");