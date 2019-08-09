public with sharing class SearchComponentController {
    
    public static Integer MAX_RESULTS = 100;
    public static String accountIcon = 'standard:account';
    public static String opptyIcon = 'standard:opportunity';
    public static String leadIcon = 'standard:lead';

    //Data Transfer Object
    class SearchResult{
        String id;
        String sobjectname;
        String icon;
        String name;

        public SearchResult(String id, String sobjectname, String icon, String name){
            this.id = id;
            this.sobjectname = sobjectname;
            this.icon = icon;
            this.name = name;
        }
    }

    @AuraEnabled
    public static String search(String searchTerm){

        // Check for any existing bookmarks
        List<Bookmark__c> bookmarks = [select Id, Record_ID__c, Object__c from Bookmark__c];
        Set<Id> accountIds = new Set<Id>();
        Set<Id> oppIds = new Set<Id>();
        Set<Id> leadIds = new Set<Id>();
        for(Bookmark__c book : bookmarks){
            if(book.Object__c == 'Account'){
                accountIds.add(book.Record_ID__c);
            }
            if(book.Object__c == 'Opportunity'){
                oppIds.add(book.Record_ID__c);
            }
            if(book.Object__c == 'Lead'){
                leadIds.add(book.Record_ID__c);
            }
        }

        // Prepare query paramters
        searchTerm += '*';

        // Execute search query
        List<List<SObject>> searchResults = [FIND :searchTerm IN ALL FIELDS RETURNING
            Account (Id, Name WHERE id NOT IN :accountIds),
            Opportunity (Id, Name WHERE id NOT IN :oppIds),
            Lead (Id, Name WHERE id NOT IN :leadIds)
            LIMIT :MAX_RESULTS];

        // Prepare results
        List<SearchResult> results = new List<SearchResult>();

        // Extract Accounts & convert them into SearchResult
        Account [] accounts = ((List<Account>) searchResults[0]);
        for (Account account : accounts) {
            results.add(new SearchResult(account.Id, 'Account', accountIcon, account.Name));
        }

        // Extract Opportunities & convert them intoSearchResult
        Opportunity [] opptys = ((List<Opportunity>) searchResults[1]);
        for (Opportunity oppty : opptys) {
            results.add(new SearchResult(oppty.Id, 'Opportunity', opptyIcon, oppty.Name));
        }

        // Extract Opportunities & convert them into SearchResult
        Lead [] leads = ((List<Lead>) searchResults[2]);
        for (Lead lead : leads) {
            results.add(new SearchResult(lead.Id, 'Lead', leadIcon, lead.Name));
        }

        System.debug(results);
        return JSON.serialize(results);

    }

    @AuraEnabled
    public static String getBookmarks(){

        List<Bookmark__c> bookmarks = [select Id, Record_ID__c, Object__c from Bookmark__c];
        Set<Id> accountIds = new Set<Id>();
        Set<Id> oppIds = new Set<Id>();
        Set<Id> leadIds = new Set<Id>();
        for(Bookmark__c book : bookmarks){
            if(book.Object__c == 'Account'){
                accountIds.add(book.Record_ID__c);
            }
            if(book.Object__c == 'Opportunity'){
                oppIds.add(book.Record_ID__c);
            }
            if(book.Object__c == 'Lead'){
                leadIds.add(book.Record_ID__c);
            }
        }

        List<SearchResult> results = new List<SearchResult>();

        for(Account acc : [select Id, Name from Account where Id in :accountIds]){
            results.add(new SearchResult(acc.Id, 'Account', accountIcon, acc.Name));
        }
        for(Opportunity opp : [select Id, Name from Opportunity where Id in :oppIds]){
            results.add(new SearchResult(opp.Id, 'Opportunity', opptyIcon, opp.Name));
        }
        for(Lead lead : [select Id, Name from Lead where Id in :leadIds]){
            results.add(new SearchResult(lead.Id, 'Lead', leadIcon, lead.Name));
        }

        System.debug(results);
        return JSON.serialize(results);
    }

    @AuraEnabled
    public static Boolean saveBookmark(String id, String sobjectname){
        try{
            insert new Bookmark__c(Record_ID__c = id, Object__c = sobjectname);
            return true;
        }catch(Exception e){
            return false;
        }
    }

    @AuraEnabled
    public static Boolean removeBookmark(String id){
        try{
            delete new Bookmark__c(Id = id);
            return true;
        }catch(Exception e){
            return false;
        }
    }

}
