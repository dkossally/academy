/* eslint-disable no-alert */
/* eslint-disable radix */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable no-console */
import { LightningElement, track } from 'lwc';
import search from '@salesforce/apex/SearchComponentController.search';
import getBookmarks from '@salesforce/apex/SearchComponentController.getBookmarks';
import saveBookmark from '@salesforce/apex/SearchComponentController.saveBookmark';


export default class SearchComponent extends LightningElement {
    
    @track searchTerm;
    @track results = [];
    @track hasResults = false;
    @track page = 0;
    @track maxpages = 0;
    @track bookmarks;

    @track myTable = 'Value from Parent';

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

    connectedCallback(){
        console.log('connected...');
        this.getCurrentBookmarks();
    }


    updateTerm(event){
        console.log(event.target.value);
        this.searchTerm = event.target.value;
        this.page = 0;
    }

    search(){
        if(this.searchTerm.length >= 2){
            console.log('Searching...');
            let obj = { searchTerm: this.searchTerm, page: this.page};
            search(obj)
                .then(result => {
                    console.log(result);
                    this.hasResults = true;
                    this.results = JSON.parse(result.searchresults);
                    this.maxpages = result.maxpages;
                    console.log(this.results.length);
                    if(this.results.length === 0){
                        this.hasResults = false;
                    }
                })
                .catch(error => {
                    this.hasResults = false;
                    console.log(error);
                });
        }
    }

    getCurrentBookmarks(){
        getBookmarks()
            .then(result => {
                console.log(result);
                this.bookmarks = JSON.parse(result);
            })
            .catch(error => {
                console.log(error);
            });
    }
    
    searchTypeahead(event){
        this.updateTerm(event);
        this.search();
    }

    nextPage(){
        this.page++;
        console.log(this.page);
        this.search();
    }

    prevPage(){
        this.page--;
        console.log(this.page);
        this.search();
    }

    navToPage(event){
        this.page = Number.parseInt(event.target.dataset.index);
        console.log(this.page);
        this.search();
    }

    saveBookmark(event){
        saveBookmark({recordId: event.target.dataset.id})
            .then(result => {
                this.bookmarks = JSON.parse(result);
                this.search();
            })
            .catch(error => {
                console.log(error);
            });
    }

    updateEvent(event){
        this.myTable = event.detail;
    }

}