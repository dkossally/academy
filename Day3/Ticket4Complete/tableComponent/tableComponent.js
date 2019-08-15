/* eslint-disable radix */
/* eslint-disable no-console */
import { LightningElement, api } from 'lwc';

export default class TableComponent extends LightningElement {

    @api results;
    @api pagination = false;
    @api hasResults = false;
    @api page = 0;
    @api maxpages = 0;

    //Dynamic Event Names
    @api actionname;
    @api pagenext;
    @api pageprev;
    @api pagenum;

    get displayBack(){
        if(this.page <= 0){
            return false;
        }
        return true;
    }

    get displayNext(){
        if(this.page >= this.maxpages){
            return false;
        }
        return true;
    }

    get displayCurrentPage(){
        let curr = this.page + 1;
        let max = this.maxpages + 1;
        return 'Page ' + curr + ' of ' + max;
    }

    get getPageNumbers(){
        let pages = [];
        let i = 0;
        while(i <= this.maxpages){
            pages.push({label: i + 1, index: i});
            i++;
        }
        return pages;
    }

    get displayAction(){
        if(this.actionname === undefined) return false;
        return true;
    }

    get getHeaderStyle(){
        let cls = 'cell headercell slds-col ';
        cls += this.actionname === undefined ? ' slds-size_2-of-6' : ' slds-size_1-of-6';
        return cls;
    }

    get getRowStyle(){
        let cls = 'cell rowcell slds-col ';
        cls += this.actionname === undefined ? ' slds-size_2-of-6' : ' slds-size_1-of-6';
        return cls;
    }

    nextPage(){
        this.dispatchEvent(new CustomEvent(this.pagenext));
    }

    prevPage(){
        this.dispatchEvent(new CustomEvent(this.pageprev));
    }

    navToPage(event){
        let num = Number.parseInt(event.target.dataset.index);
        this.dispatchEvent(new CustomEvent(this.pagenum, {detail: num}));
    }

    actionHandler(event){
        this.dispatchEvent(new CustomEvent(this.actionname, {detail: event.target.dataset.id}));
    }
}