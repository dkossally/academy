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
    @track hasBookmarks = false;
    @track page = 0;
    @track maxpages = 0;
    @track bookmarks;

    shouldDisplayPages = true;
    displayAction = false;

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
                this.hasBookmarks = this.bookmarks.length > 0 ? true : false;
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
        this.search();
    }

    prevPage(){
        this.page--;
        this.search();
    }

    navToPage(event){
        this.page = event.detail;
        this.search();
    }

    saveBookmark(event){
        saveBookmark({recordId: event.detail})
            .then(result => {
                this.bookmarks = JSON.parse(result);
                this.search();
            })
            .catch(error => {
                console.log(error);
            });
    }

}