const e_matrixMixerComponents = {
    AudioSources : 0 ,
    AudioReceiver : 1 ,
    mixDisplay : 2,
    last : 3
};

const e_matrixMixerHeaders = {
    cardMachine : 0 ,
    cardName : 1 ,
    channelGroupe : 2 ,
    channelName : 3 ,
    channelResume : 4 ,
    last : 5
};

class gridMatrix {
    constructor(p_containerSelector, p_numColumns, p_numRows, p_cellSize) {
        this.m_matrixMixer = document.querySelector(p_containerSelector);
        this.m_cols = p_numColumns;
        this.m_rows = p_numRows;
        this.m_cellSize = p_cellSize;
        this.m_ChannelGroupeRange = 8 ;
        this.m_AudioWay = e_AudioWay.input;
        this.m_expansionLevel = 3;
        this.isHideColVisible = false
        this.isHideRowVisible = false
        this.m_isSelecting = false;
        this.m_isDragging = false;
        this.m_isSpacePressed = false;

        this.m_matrixMixerData = new Array(e_matrixMixerComponents.last);
        this.initMatrixMixerData()

        this.initGridMatrix();
    }

    //Init Data
    initMatrixMixerData(){
        for ( let l_mixerComponentIdx = 0 ; l_mixerComponentIdx < e_matrixMixerComponents.last ; l_mixerComponentIdx ++){
            switch(l_mixerComponentIdx){
                case e_matrixMixerComponents.AudioSources:
                case e_matrixMixerComponents.AudioReceiver:
                    this.m_matrixMixerData[l_mixerComponentIdx] = [];
                    for ( let l_MixerHeadersIdx = 0 ; l_MixerHeadersIdx < e_matrixMixerHeaders.last ; l_MixerHeadersIdx ++  ){
                        this.m_matrixMixerData[l_mixerComponentIdx][l_MixerHeadersIdx] = [];
                    }
                    break;
                case e_matrixMixerComponents.mixDisplay:
                    this.m_matrixMixerData[l_mixerComponentIdx] = []
                    break;
                default:
                    break;
            }
        }
    }

    initGridMatrix() {
        this.createMixerContext(this.m_matrixMixer, true)
        this.updateGridDimensionsCSS()
        this.addEventListeners();
    }

    //Update Data //Est appelé Ailleurs
    updateHeaders(p_audioWay, p_channelIdx) {
        const l_cardAlias = g_Gui.getDevice().getAlias();
        const l_nbCards = l_cardAlias ? 1 : 0;
        const l_channelAlias = g_Gui.getDevice().getChanAlias(p_audioWay, p_channelIdx);
        const l_numItems = 64;

        if (p_audioWay === e_AudioWay.input ) {
            this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.cardMachine] = [{l_nbCards}];
            this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.cardName] = [{l_cardAlias}];
            this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelGroupe] = this.getIntervals(l_numItems,this.m_ChannelGroupeRange);
            this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName].push({l_channelAlias});
            this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelResume] = Array.from({ length: 8 }, (_, i) => i + 1)
        } else {
            if (l_channelAlias) {
                this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.cardMachine] = [{l_nbCards}];
                this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.cardName] = [{l_cardAlias}];
                this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName] = this.getIntervals(l_numItems,this.m_ChannelGroupeRange);
                this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName].push({l_channelAlias});
                this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelResume] = Array.from({length: 8}, (_, i) => i + 1);
            } else {
                this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName].push(l_channelAlias);
            }
        }

    }

    //Insert Data on m_matrixMixerData
    createMixerContext(p_container , p_source){
        try {
            //Restructuration du tableau pour utilisation dans le DOM
            let l_matrixMixerData = this.m_matrixMixerData[p_source ? e_matrixMixerComponents.AudioSources : e_matrixMixerComponents.AudioReceiver];

            // Get card name
            let l_cardAlias = g_Gui.getDevice().getAlias();

            // Nb of chan
            let l_nbChannels = p_source ? this.m_cols : this.m_rows;

            // Name of intervals
            let l_namesOfIntervals = this.getIntervals(l_nbChannels,this.m_ChannelGroupeRange)
            let l_intervalsIndex = this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelResume].map((num) => num)


            // Parcours des machines pour les columnHeadersGeneral
            for (let l_idxOfMachine = 0; l_idxOfMachine < l_nbChannels; l_idxOfMachine++) {
                let l_fctDrawGeneralHeaderContainer = p_source ? this.createColumnHeadersContainer(0) : this.createRowHeadersContainer(0);
                let l_fctDrawHeaderContainer = p_source ? this.createColHeader1() : this.createRowHeader1();

                if (!l_matrixMixerData[e_matrixMixerHeaders.cardMachine].includes(l_fctDrawGeneralHeaderContainer)) {
                    l_matrixMixerData[e_matrixMixerHeaders.cardMachine][l_idxOfMachine].push(l_fctDrawGeneralHeaderContainer);
                }
                if (!l_matrixMixerData[e_matrixMixerHeaders.cardName].includes(l_fctDrawHeaderContainer)) {
                    l_matrixMixerData[e_matrixMixerHeaders.cardName][l_idxOfMachine].push(l_fctDrawHeaderContainer);
                }
            }

            // Parcours des canaux source audio pour les groupes et les channels resume, et les channels
            for (let l_idxChannel = 0; l_idxChannel < l_nbChannels; l_idxChannel++) {
                let l_cardName = l_matrixMixerData[e_matrixMixerHeaders.cardName][l_idxChannel]

                let l_fctDrawChannelGroupes = p_source ? this.createColHeader2(l_namesOfIntervals) : this.createRowHeader2(l_namesOfIntervals);
                let l_fctDrawChannelNames= p_source ? this.createColHeader3(l_cardName) : this.createRowHeader3(l_cardName);
                let l_fctDrawChannelResume = p_source ? this.createHideColHeader3(l_idxChannel,l_intervalsIndex) : this.createHideRowHeader3(l_nbChannels,l_intervalsIndex);

                // Ajouter le nom du canal uniquement si nécessaire
                if (!l_matrixMixerData[e_matrixMixerHeaders.channelName].includes(l_fctDrawChannelNames)) {
                    l_matrixMixerData[e_matrixMixerHeaders.channelName].push(l_fctDrawChannelNames);				}

                if (l_idxChannel % this.m_ChannelGroupeRange === 0) {
                    // Création des channelGroupes
                    if (!l_matrixMixerData[e_matrixMixerHeaders.channelGroupe].includes(l_fctDrawChannelGroupes)) {
                        l_matrixMixerData[e_matrixMixerHeaders.channelGroupe].push(l_fctDrawChannelGroupes);
                    }
                    // Création des colonnes de résumé
                    if (!l_matrixMixerData[e_matrixMixerHeaders.channelResume].includes(l_fctDrawChannelResume)) {
                        l_matrixMixerData[e_matrixMixerHeaders.channelResume].push(l_fctDrawChannelResume);
                    }
                }

            }

            console.log(this.m_matrixMixerData)

            this.createGrid(p_source, l_matrixMixerData);
        } catch (error) {
            console.error(`Erreur lors de l'insertion de donnée dans le tableau m_matrixMixerData : ${error}`);
        }
    }

    getExpansionLevel() {
        return this.m_expansionLevel;
    }

    getIntervals(numItems, intervalSize) {
        let l_intervals = [];
        for (let i = 0; i < numItems; i += intervalSize) {
            let start = i + 1;
            let end = Math.min(i + intervalSize, numItems);
            l_intervals.push(`${start}-${end}`);
        }
        return l_intervals;
    }

    getNbOfMachineCols(){
        this.m_nbofMachineCols = this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.cardName].length + 1 ;
        return this.m_nbofMachineCols;
    }

    getNbOfMachineRows(){
        this.m_nbofMachineRows = this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.cardName].length + 1 ;
        return this.m_nbofMachineRows;
    }

    updateGridDimensionsCSS() {
        this.getNbOfMachineCols();
        this.getNbOfMachineRows();
        this.m_matrixMixer.style.setProperty('--cellSize', `${this.m_cellSize}px`);
        this.m_matrixMixer.style.setProperty('--cols', `${this.m_cols}`);
        this.m_matrixMixer.style.setProperty('--rows', `${this.m_rows}`);
        this.m_matrixMixer.style.setProperty('--cols-length', `${this.m_nbofMachineCols}`);
        this.m_matrixMixer.style.setProperty('--rows-length', `${this.m_nbofMachineRows}`);
    }

    // ColumnHeaders Container
    createColumnHeaders() {
        return {
            tag : 'div',
            class : 'columnsContainer'
        }
    }

    createColumnHeadersContainer(p_colContainerIndex){
        return {
            tag : 'div',
            class : `columnHeaders${p_colContainerIndex + 1}`,
            innerHTML : ''
        }
    }

    createColHeader1() {
        return {
            tag : 'div',
            class : ['headers', 'colHeader1'],
            innerHTML : ''
        }
    }

    createColHeader2(p_colInterval){
        return {
            tag : 'div',
            class : ['headers', 'colHeader2'],
            children: [
                {
                    tag: 'div',
                    class : ['colHeader2Content'],
                    textContent: `${p_colInterval}`
                }
            ],
            addMinusPlusBtn: true
        }
    }

    createColHeader3(p_colName){
        return {
            tag : 'div',
            class : ['headers', 'colHeader3'],
            children: [
                {
                    tag: 'div',
                    class : ['colHeader3Content'],
                    textContent: `${p_colName}`
                }
            ]
        }
    }

    createHideColHeader3(p_colIndex, p_colIntervalIndex){
        return {
            tag : 'div',
            class : ['headers', 'colHideHeader3','hidden'],
            children: [
                {
                    tag: 'div',
                    class : ['colHeader3Content'],
                    textContent: `${p_colIndex}`,
                    attributes : {
                        'data-col-interval-index': `${p_colIntervalIndex}`
                    }
                }
            ]
        }
    }

    // RowHeaders Container
    createRowHeaders() {
        return {
            tag : 'div',
            class : 'rowsContainer'
        }
    }

    createRowHeadersContainer(p_rowContainerIndex){
        return {
            tag: 'div',
            class : `rowHeaders${p_rowContainerIndex + 1}`,
            innerHTML : ''
        }
    }

    createRowHeader1(){
        return {
            tag : 'div',
            class : ['headers', 'rowHeader1'],
            innerHTML : ''
        }
    }

    createRowHeader2(p_rowInterval){
        return {
            tag : 'div',
            class : ['headers', 'rowHeader2'],
            innerText : `${p_rowInterval}`,
            addMinusPlusBtn: true
        }
    }

    createRowHeader3(p_rowName) {
        return {
            tag : 'div',
            class : ['headers', 'rowHeader3'],
            innerText : `${p_rowName}`
        }
    }

    createHideRowHeader3(p_rowIndex, p_rowIntervalIndex){
        return {
            tag : 'div',
            class : ['headers', 'hideRowHeader3', 'hidden'],
            innerText : `${p_rowIndex}`,
            attributes : {
                'data-row-interval-index': `${p_rowIntervalIndex}`
            }
        }
    }

    // CellContainer
    createCells() {
        return {
            tag : 'div',
            class : 'cellsContainer'
        }
    }

    createCellsContainer(){
        return {
            tag : 'div',
            class : 'gridCellContainer'
        }
    }

    createCellElement(rowIndex,colIndex,colIntervalIndex,rowIntervalIndex,cellValue){
        return {
            tag: 'div',
            class: 'cell',
            attributes: {
                'data-row': `${rowIndex + 1}`,
                'data-col': `${colIndex + 1}`,
                'data-col-interval-index': `${colIntervalIndex}`,
                'data-row-interval-index': `${rowIntervalIndex}`
            },
            innerText: `${cellValue}`,
            eventListener: {
                type: 'click',
                handler: this.handleMouseClick.bind(this)
            }
        }
    }

    // EmptyContainer
    createEmptyContainer() {
        let l_emptyContainer = document.createElement("div");
        l_emptyContainer.classList.add("emptyContainer", "headers");
        l_emptyContainer.innerText = "New Grid";
        return l_emptyContainer
    }

    //CreateElementFromObject
    createElementFromObject(obj) {
        const element = document.createElement(obj.tag);

        // Ajouter les classes
        if (Array.isArray(obj.class)) {
            obj.class.forEach(cls => element.classList.add(cls));
        } else if (obj.class) {
            element.classList.add(obj.class);
        }

        // Ajouter le contenu texte ou HTML
        if (obj.innerText) {
            element.innerText = obj.innerText;
        }
        if (obj.innerHTML) {
            element.innerHTML = obj.innerHTML;
        }

        // Ajouter des attributs si définis
        if (obj.attributes) {
            for (const [key, value] of Object.entries(obj.attributes)) {
                element.setAttribute(key, value);
            }
        }

        // Ajouter des enfants (si présents)
        if (obj.children) {
            obj.children.forEach(childObj => {
                const childElement = this.createElementFromObject(childObj);
                element.appendChild(childElement);
            });
        }

        // Ajouter un listener d'événement (si défini)
        if (obj.eventListener) {
            element.addEventListener(obj.eventListener.type, obj.eventListener.handler);
        }

        // Ajouter le bouton Minus/Plus si nécessaire
        if (obj.addMinusPlusBtn) {
            this.addMinusPlusBtn(element);
        }

        return element;
    }

    //Grid on DOM
    createGrid(p_source, p_matrixMixerData) {
        try {
            // const fragment = document.createDocumentFragment();
            // // Containers
            // let l_divHeaderContainer = p_source ? this.createColumnHeadersContainer(0) : this.createRowHeadersContainer(0);
            //
            // // Création
            // l_divHeaderContainer.appendChild(p_matrixMixerData[e_matrixMixerHeaders.cardName]);
            //
            // // Ajout des div groupe dans l'ordre : Container AudioSources
            // for (let l_idxGroupe = 0; l_idxGroupe < p_matrixMixerData[e_matrixMixerHeaders.channelGroupe].length; l_idxGroupe++) {
            // 	l_divHeaderContainer.appendChild(this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelGroupe][l_idxGroupe]);
            // }
            //
            // // Ajout des canaux dans l'ordre : container
            // for (let l_idxChannel = 0; l_idxChannel < this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName].length; l_idxChannel++) {
            // 	l_divHeaderContainer.appendChild(this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName][l_idxChannel]);
            // 	if (l_idxChannel % this.m_ChannelGroupeRange === 0) {
            // 		// Ajout des div resume
            // 		l_divHeaderContainer.appendChild(this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelResume][l_idxChannel]);
            // 	}
            // }
            //
            // // Ajout des div groupe dans l'ordre : Container AudioReceiver
            // for (let l_idxGroupe = 0; l_idxGroupe < p_matrixMixerData[e_matrixMixerHeaders.channelGroupe].length; l_idxGroupe++) {
            // 	l_divHeaderContainer.appendChild(this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelGroupe][l_idxGroupe]);
            // }
            //
            // // Ajout des canaux dans l'ordre : container AudioReceiver
            // for (let l_idxChannel = 0; l_idxChannel < this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName].length; l_idxChannel++) {
            // 	l_divHeaderContainer.appendChild(this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName][l_idxChannel]);
            // 	if (l_idxChannel % this.m_ChannelGroupeRange === 0) {
            // 		// Ajout des div resume
            // 		l_divHeaderContainer.appendChild(this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelResume][l_idxChannel]);
            // 	}
            // }
            //
            // let divCellContainer = document.createElement("div");
            // divCellContainer.classList.add("cellsContainer")

            this.m_matrixMixer.innerHTML = "";
            // Buttons Container
            this.addExpandCollapseButtons();
            // Grid Container
            this.l_MatrixContainer = document.createElement("div");
            this.l_MatrixContainer.classList.add("matrixContainer");
            this.m_matrixMixer.appendChild(this.l_MatrixContainer);

            // Empty Container
            this.createEmptyContainer();

            // Column Headers
            this.createColumnHeaders();

            // Row Headers
            this.createRowHeaders();

            // Grid Cells
            this.createCells();

        } catch (error) {
            console.error(`Erreur lors de l'exécution de createGrid : ${error}`);
        }
    }


    //EventListener
    addEventListeners() {
        this.m_matrixMixer.addEventListener("mousedown", (p_event) => this.handleMouseDown(p_event));
        this.m_matrixMixer.addEventListener("mouseup", (p_event) => this.handleMouseUp(p_event));
        this.m_matrixMixer.addEventListener("mousemove", (p_event) => this.handleMouseMove(p_event));
        this.m_matrixMixer.addEventListener("dblclick", (p_event) => this.handleDoubleClick(p_event));
        this.m_matrixMixer.addEventListener("mouseleave", (p_event) => this.handleMouseLeave(p_event));
        window.addEventListener("keydown", (p_event) => this.handleSpaceKeydown(p_event))
        window.addEventListener("keyup", (p_event) => this.handleSpaceKeyup(p_event))
    }

    handleMouseClick(p_event) {
        p_event.preventDefault();
    }

    handleDoubleClick(p_event) {
        const l_cell = p_event.target;
        if (l_cell.classList.contains("cell") && !l_cell.classList.contains("header")) {
            const l_row = parseInt(l_cell.getAttribute('data-row'));
            const l_col = parseInt(l_cell.getAttribute('data-col'));
            this.showInputBox(l_row, l_col, l_cell);
        }
    }

    handleMouseDown(p_event) {
        if (this.m_isSpacePressed) {
            this.m_isDragging = true;
            this.startX = p_event.pageX - this.m_matrixMixer.scrollLeft;
            this.startY = p_event.pageY - this.m_matrixMixer.scrollTop;
            this.scrollLeft = this.m_matrixMixer.scrollLeft;
            this.scrollTop = this.m_matrixMixer.scrollTop;
            this.m_matrixMixer.style.cursor = 'grabbing'; // Changement du curseur
        }
    }

    handleMouseMove(p_event) {
        const l_cell = p_event.target;
        if (l_cell.classList.contains("cell")) {
            const l_row = parseInt(l_cell.getAttribute('data-row'));
            const l_col = parseInt(l_cell.getAttribute('data-col'));
            this.crossHair(l_row, l_col);
            this.gridInfos(l_row, l_col, l_cell);
        } else {
            this.clearCrossHair();
            this.hideGridInfos();
        }
        if (this.m_isDragging) {
            const x = p_event.pageX - this.m_matrixMixer.scrollLeft;
            const y = p_event.pageY - this.m_matrixMixer.scrollTop;
            const walkX = x - this.startX;
            const walkY = y - this.startY;
            this.m_matrixMixer.scrollLeft = this.scrollLeft - walkX;
            this.m_matrixMixer.scrollTop = this.scrollTop - walkY;
        }
    }

    handleMouseUp() {
        if (this.m_isSelecting) {
            this.m_isSelecting = false;
        }
        this.m_isDragging = false;
        this.m_matrixMixer.style.cursor = 'grab';
    }

    handleMouseLeave(p_event) {
        const l_cell = p_event.target;
        if (l_cell.classList.contains("cell")) {
            const l_row = parseInt(l_cell.getAttribute('data-row'));
            const l_col = parseInt(l_cell.getAttribute('data-col'));
            this.showInputBox(l_row, l_col, l_cell);
        }
        this.m_isDragging = false;
    }

    handleSpaceKeydown(p_event) {
        if (p_event.code === 'Space' && !this.m_isSpacePressed) {
            p_event.preventDefault();
            this.m_isSpacePressed = true;
            this.m_matrixMixer.style.cursor = 'grab';
            p_event.preventDefault();
        }
    }

    handleSpaceKeyup(p_event) {
        if (p_event.code === 'Space') {
            this.m_isSpacePressed = false;
            this.m_matrixMixer.style.cursor = '';
            this.m_isDragging = false;
        }
    }

    //CrossHair
    crossHair(p_row, p_col) {
        this.clearCrossHair();
        // const l_gridCell = this.m_matrixMixer.querySelectorAll(".cell");
        let l_gridCell = this.m_matrixMixerData.cells;

        l_gridCell.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    console.log(cell);
                    if(rowIndex === p_row || colIndex === p_col) {
                        cell.classList.add("highlight");
                    }
                    if(rowIndex === p_row && colIndex === p_col){
                        cell.classList.add("hovered");
                    }
                })
            }
        );

        // Ajouter la classe highlight aux en-têtes de ligne et de colonne correspondants
        const rowHeaders3 = this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName]
        const colHeaders3 = this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName]

        rowHeaders3.forEach((header) => {
            const headerRow = parseInt(header.textContent);
            if (headerRow === p_row) {
                header.style.backgroundColor = "#FFFFFF21";
            }
        });

        colHeaders3.forEach((header) => {
            const headerCol = parseInt(header.textContent);
            if (headerCol === p_col) {
                header.style.backgroundColor = "#FFFFFF21";
            }
        });
    }

    clearCrossHair() {
        const l_gridCell = this.m_matrixMixer.querySelectorAll(".cell");
        const rowHeaders3 = this.m_matrixMixer.querySelectorAll(".rowHeader3");
        const colHeaders3 = this.m_matrixMixer.querySelectorAll(".colHeader3");

        l_gridCell.forEach((p_cell) => {
            p_cell.classList.remove("highlight");
            p_cell.classList.remove("hovered");
        });

        rowHeaders3.forEach((header) => {
            header.style.backgroundColor = "#444";
        });

        colHeaders3.forEach((header) => {
            header.style.backgroundColor = "#444";
        });

    }

    gridInfos(p_row, p_col, p_cell) {
        let l_gridInfos = this.getOrCreateGridInfos();

        // Masquer temporairement pour repositionner
        l_gridInfos.style.display = "none";
        const l_rect = p_cell.getBoundingClientRect();
        const l_gridInfosOffset = 10;
        const l_mixerNumber = p_cell.getAttribute('data-col') || '';
        const l_outputNumber = p_cell.getAttribute('data-row') || '';

        // Mise à jour du contenu
        this.updateGridInfosContent(l_gridInfos, l_mixerNumber, l_outputNumber);

        // Calcul de la position et du décalage
        const mixerNumberLength = l_mixerNumber.length;
        const additionalOffset = this.calculateOffset(mixerNumberLength);

        this.positionGridInfos(l_gridInfos, l_rect, l_gridInfosOffset, additionalOffset);

        // Masquer les informations si au bord
        this.adjustVisibility(l_gridInfos, l_rect, l_gridInfosOffset, additionalOffset);

        // Afficher le div gridInfos
        l_gridInfos.style.display = "block";
    }

    getOrCreateGridInfos() {
        let l_gridInfos = document.getElementById("gridInfos");

        if (!l_gridInfos) {
            l_gridInfos = document.createElement("div");
            l_gridInfos.id = "gridInfos";
            l_gridInfos.style.position = "absolute";
            this.m_matrixMixer.appendChild(l_gridInfos);
        }
        return l_gridInfos;
    }

    updateGridInfosContent(l_gridInfos, mixerNumber, outputNumber) {
        l_gridInfos.innerHTML = `
        <div class="mixerGridInfos">Mixer ${mixerNumber}</div>
        <div class="outputGridInfos">Output ${outputNumber}</div>
    `;
    }

    calculateOffset(mixerNumberLength) {
        return (mixerNumberLength - 1) * 5;
    }

    positionGridInfos(l_gridInfos, l_rect, l_gridInfosOffset, additionalOffset) {
        l_gridInfos.style.left = `${l_rect.left + window.scrollX - (this.m_cellSize * 4) - l_gridInfosOffset - additionalOffset}px`;
        l_gridInfos.style.top = `${l_rect.top + window.scrollY - (this.m_cellSize * 3) + l_gridInfosOffset}px`;
    }

    adjustVisibility(l_gridInfos, l_rect, l_gridInfosOffset, additionalOffset) {
        const isTooCloseToTop = l_rect.top < (this.m_cellSize * 9) + l_gridInfosOffset;
        const isTooCloseToLeft = l_rect.left < (this.m_cellSize * 7) + l_gridInfosOffset + additionalOffset;

        const mixerInfo = l_gridInfos.querySelector('.mixerGridInfos');
        const outputInfo = l_gridInfos.querySelector('.outputGridInfos');

        if (isTooCloseToTop) mixerInfo.style.display = 'none';
        if (isTooCloseToLeft) outputInfo.style.display = 'none';
    }

    hideGridInfos() {
        const l_gridInfos = document.getElementById("gridInfos");
        if (l_gridInfos) {
            l_gridInfos.style.display = "none";
        }
    }

    //InputBox
    showInputBox(p_row, p_col, p_cell) {
        const l_input = document.createElement("input");
        l_input.classList.add("inputBox");
        l_input.type = "number";
        l_input.value = this.m_matrixMixerData.cells[`${p_row - 1}`][`${p_col - 1}`];

        p_cell.innerHTML = "";
        p_cell.appendChild(l_input);
        l_input.focus();

        const updateCell = () => {
            const newValue = l_input.value;
            if (newValue !== "") {
                this.m_matrixMixerData.cells[`${p_row - 1}`][`${p_col - 1}`] = newValue;
            }
            this.createGrid();
        };

        l_input.addEventListener("blur", updateCell);

        l_input.addEventListener("keydown", (p_event) => {
            if (p_event.key === "Enter") {
                updateCell();
            }
        });

        document.addEventListener("click", (p_event) => {
            if (!p_cell.contains(p_event.target) && p_event.target !== l_input) {
                l_input.style.display = "none";
            }
        }, { once: true });
    }

    //Boutons
    addExpandBtn(p_frame) {
        const l_addExpandBtn = document.createElement("button");
        l_addExpandBtn.textContent = "Expand";
        l_addExpandBtn.addEventListener("click", () => this.expandGrid());
        p_frame.appendChild(l_addExpandBtn);
    }

    addCollapseBtn(p_frame) {
        const l_addCollapseBtn = document.createElement("button");
        l_addCollapseBtn.textContent = "Collapse";
        l_addCollapseBtn.addEventListener("click", () => this.collapseGrid());
        p_frame.appendChild(l_addCollapseBtn);
    }

    addOptimalBtn(p_frame) {
        const l_addOptimaleBtn = document.createElement("button");
        l_addOptimaleBtn.textContent = "Optimal";
        l_addOptimaleBtn.addEventListener("click", () => this.optimalGrid());
        p_frame.appendChild(l_addOptimaleBtn);
    }

    addExpandCollapseButtons() {
        const l_expandCollapseButtons = document.createElement("div");
        l_expandCollapseButtons.className = "btnContainer";
        this.addExpandBtn(l_expandCollapseButtons);
        this.addCollapseBtn(l_expandCollapseButtons);
        this.addOptimalBtn(l_expandCollapseButtons);
        this.m_matrixMixer.appendChild(l_expandCollapseButtons);
    }

    expandGrid() {
        if (this.m_expansionLevel < 3) {
            this.m_expansionLevel++;
            this.getExpansionLevel();
            this.createGrid(this.m_expansionLevel);
        } else {
            console.log("Expansion_lvl max à ", this.m_expansionLevel);
        }
    }

    optimalGrid() {
        if (this.m_expansionLevel >= 1) {
            this.m_expansionLevel = 2
            this.getExpansionLevel();
            this.updateGridDataForExpansion(this.m_expansionLevel, this.m_cols, this.m_rows)
            this.createGrid(this.m_expansionLevel);
        } else {
            console.log("Expansion Optimal impossible")
        }
    }

    collapseGrid() {
        if (this.m_expansionLevel > 1) {
            this.m_expansionLevel--;
            this.getExpansionLevel();
            if (this.m_expansionLevel === 1) {
                this.hideHeaders();
                this.updateGridDataForExpansion(this.m_expansionLevel);
                this.createGrid(this.m_expansionLevel);
            } else if (this.m_expansionLevel === 2) {
                this.hideHeaders3();
                this.showInvisibleHeaders3()
                this.updateGridDataForExpansion(this.m_expansionLevel)
                this.createGrid(this.m_expansionLevel);
            }
        } else {
            console.log("Expansion_lvl min à ", this.m_expansionLevel);
        }
    }

    hideHeaders3() {
        // Cache les en-têtes de colonnes et lignes dans level3
        this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName] = this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName].map(header => ({ ...header, hidden: true }));
        this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName] = this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName].map(header => ({ ...header, hidden: true }));
    }

    showInvisibleHeaders3() {
        // Affiche les colonnes et lignes cachées
        this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelResume] = this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelResume].map(header => ({ ...header, hidden: false }));
        this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelResume] = this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelResume].map(header => ({ ...header, hidden: false }));
    }

    hideHeaders() {
        // Cache les en-têtes de colonnes level2, level3 et hideColumns
        const { level2, level3, hideColumns } = this.m_matrixMixerData.columns;
        this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelGroupe] = level2.map(header => ({ ...header, hidden: true }));
        this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelName] = level3.map(header => ({ ...header, hidden: true }));
        this.m_matrixMixerData[e_matrixMixerComponents.AudioSources][e_matrixMixerHeaders.channelResume] = hideColumns.map(header => ({ ...header, hidden: true }));

        // Cache les en-têtes de lignes level2, level3 et hideRows
        const { level2: rowLevel2, level3: rowLevel3, hideRows } = this.m_matrixMixerData.rows;
        this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName] = rowLevel2.map(header => ({ ...header, hidden: true }));
        this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelName] = rowLevel3.map(header => ({ ...header, hidden: true }));
        this.m_matrixMixerData[e_matrixMixerComponents.AudioReceiver][e_matrixMixerHeaders.channelResume] = hideRows.map(header => ({ ...header, hidden: true }));
    }

    updateGridDataForExpansion(level,p_cols, p_rows) {
        switch (level) {
            case 1:
                this.m_cols = Math.ceil(this.m_cols / 64);
                this.m_rows = Math.ceil(this.m_rows / 64);
                this.m_cellSize = this.m_cellSize * 16;
                break;
            case 2:
                this.m_cols = Math.ceil(this.m_cols / 8);
                this.m_rows = Math.ceil(this.m_rows / 8);
                this.m_cellSize = this.m_cellSize * 4;
                break;
            case 3:
                this.m_cols = p_cols;
                this.m_rows = p_rows;
                this.m_cellSize = 19;
                break;
            default:
                console.error('Niveau d\'expansion inconnu');
                break;
        }
        this.updateGridDimensionsCSS();
    }

    //MinusPlusButton
    addMinusPlusBtn(p_frame) {
        const l_addMinusPlusBtn = document.createElement("button");
        l_addMinusPlusBtn.textContent = "-";
        l_addMinusPlusBtn.classList.add("minus-btn");
        l_addMinusPlusBtn.addEventListener('click', () => {
            const p_type =
                p_frame.hasAttribute('data-col-interval-index')
                    ? "column"
                    : p_frame.hasAttribute('data-row-interval-index')
                        ? "row"
                        : "";

            if (!p_type) {
                console.error("Type non déterminé pour p_frame.");
                return;
            }

            const isMinus = l_addMinusPlusBtn.classList.contains('minus-btn');
            this.transformBtn(l_addMinusPlusBtn, p_frame, isMinus, p_type);
        });

        p_frame.appendChild(l_addMinusPlusBtn);
    }

    transformBtn(p_btn, p_frame, isMinus, p_type) {
        p_btn.textContent = isMinus ? "+" : "-";
        p_btn.classList.toggle("minus-btn", !isMinus);
        p_btn.classList.toggle("plus-btn", isMinus);

        if (p_type === "column") {
            this.toggleColumn(p_frame.dataset.colIntervalIndex, isMinus);
        } else if (p_type === "row") {
            this.toggleRow(p_frame.dataset.rowIntervalIndex, isMinus);
        }
    }

    toggleColumn(index, isMinus) {
        // Toggle la visibilité de la colonne
        let colCells = this.l_gridCellContainer.querySelectorAll(`.grid-cell[data-col-interval-index="${index}"]`);
        let colHideCells = this.l_gridCellContainer.querySelectorAll(`.hiddenCellCol[data-col-interval-index="${index}"]`);
        let headerHideColHeaders3 = this.l_columnHeadersContainer.querySelectorAll(`.hideColHeader3[data-interval-index="${index}"]`);
        let headerColHeaders3 = this.l_columnHeadersContainer.querySelectorAll(`.colHeader3[data-interval-index="${index}"]`);

        if (isMinus) {
            // Masquer les cellules de la colonne
            colCells.forEach(cell => {
                cell.classList.add('hidden');
            });
            colHideCells.forEach(hideCell => {
                hideCell.classList.remove('hidden');
            });

            // Gérer les en-têtes de colonnes
            headerHideColHeaders3.forEach(header => {
                header.classList.remove('hidden');
                header.style.gridColumn = `span 8`;
                header.style.width = `166px`;
            });
            headerColHeaders3.forEach(header => {
                header.classList.add('hidden');
            });

            // Synchroniser la visibilité des lignes affectées par la colonne
            this.l_gridCellContainer.querySelectorAll(`[data-col-interval-index="${index}"]`).forEach(cell => {
                let rowIndex = cell.getAttribute('data-row');
                // Masquer les cellules correspondantes dans la ligne
                if (this.isHideRowVisible) {
                    let rowCells = this.l_gridCellContainer.querySelectorAll(`[data-row="${rowIndex}"]`);
                    rowCells.forEach(rowCell => {
                        rowCell.classList.add('hidden');
                    });
                }
            });

            this.isHideColVisible = !this.isHideColVisible; // Mettre à jour l'état de la colonne
        } else {
            // Réafficher les cellules de la colonne et masquer les cellules cachées
            colCells.forEach(cell => {
                cell.classList.remove('hidden');
            });
            colHideCells.forEach(hideCell => {
                hideCell.classList.add('hidden');
            });

            // Gérer les en-têtes des colonnes
            headerHideColHeaders3.forEach(header => {
                header.classList.add('hidden');
            });
            headerColHeaders3.forEach(header => {
                header.classList.remove('hidden');
            });

            this.isHideColVisible = !this.isHideColVisible; // Remettre l'état de la colonne à visible

            // Ré-afficher toutes les lignes si visibles
            if (this.isHideRowVisible) {
                this.l_gridCellContainer.querySelectorAll(`[data-row]`).forEach(cell => {
                    cell.classList.remove('hidden');
                });
            }
        }
    }

    toggleRow(index, isMinus) {
        // Toggle the visibility of the hidden row
        let rowCells = this.l_gridCellContainer.querySelectorAll(`.grid-cell[data-row-interval-index="${index}"]`);
        let rowHideCells = this.l_gridCellContainer.querySelectorAll(`.hiddenCellRow[data-row-interval-index="${index}"]`);
        let headerHideRowHeader3 = this.l_rowHeadersContainer.querySelectorAll(`.hideRowHeader3[data-interval-index="${index}"]`);
        let headerRowHeaders3 = this.l_rowHeadersContainer.querySelectorAll(`.rowHeader3[data-interval-index="${index}"]`);

        if (isMinus) {
            // Masquer les cellules de la ligne
            rowCells.forEach(cell => {
                cell.classList.add('hidden');
            });

            rowHideCells.forEach(hideCell => {
                hideCell.classList.remove('hidden');
            });

            // Gérer les en-têtes de lignes
            headerHideRowHeader3.forEach(header => {
                header.classList.remove('hidden');
                header.classList.add('flex');
                header.style.gridRow = `span 8`;
                header.style.height = `167px`;
            });
            headerRowHeaders3.forEach(header => {
                header.classList.remove('flex');
                header.classList.add('hidden');
            });

            this.isHideRowVisible = !this.isHideRowVisible; // Mettre à jour l'état de la ligne

            // Synchroniser la visibilité des colonnes affectées par la ligne
            let l_gridCellsColInterval =  this.l_gridCellContainer.querySelectorAll(`[data-interval-index="${index}"]`)
            l_gridCellsColInterval.forEach(cell => {
                let colIndex = cell.getAttribute('data-col');
                let rowIndex = cell.getAttribute('data-row');
                // Masquer les cellules correspondantes dans la colonne
                if (this.isHideColVisible && colIndex === index && rowIndex === index) {
                    let colCells = this.l_gridCellContainer.querySelectorAll(`[data-col="${colIndex}"]`);
                    colCells.forEach(colCell => {
                        colCell.classList.add('hidden');
                    });
                }
            });

        } else {
            // Réafficher les cellules de la ligne et masquer les cellules cachées
            rowCells.forEach(cell => {
                cell.classList.remove('hidden');
            });

            rowHideCells.forEach(hideCell => {
                hideCell.classList.add('hidden');
            });

            // Gérer les en-têtes des lignes
            headerHideRowHeader3.forEach(header => {
                header.classList.remove('flex');
                header.classList.add('hidden');
                header.style.gridRow = `span 1`;
                header.style.height = ``;
            });

            headerRowHeaders3.forEach(header => {
                header.classList.remove('hidden');
            });

            this.isHideRowVisible = !this.isHideRowVisible; // Remettre l'état de la ligne à visible

            // Ré-afficher toutes les colonnes si visibles
            if (this.isHideColVisible) {
                this.l_gridCellContainer.querySelectorAll(`[data-col]`).forEach(cell => {
                    cell.classList.remove('hidden');
                });
            }
        }
    }

}

function createGridMatrix(p_containerSelector, p_numColumns, p_numRows, p_cellSize) {
    return new gridMatrix(p_containerSelector, p_numColumns, p_numRows, p_cellSize);
}

createGridMatrix("#matrixMixer", 64, 64, 19)