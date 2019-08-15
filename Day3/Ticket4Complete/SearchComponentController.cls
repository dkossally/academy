public with sharing class SearchComponentController {
    
    public static Integer PAGE_SIZE = 5;
    public static String accountIcon = 'standard:account';
    public static String contactIcon = 'standard:contact';
    public static String opptyIcon = 'standard:opportunity';
    public static String leadIcon = 'standard:lead';

    //Data Transfer Object - Ticket 2
    class SearchResult implements Comparable{
        String id;
        String sobjectname;
        String icon;
        Datetime createddate;
        String name;
        String bookmarkid;

        public SearchResult(String id, String sobjectname, String icon, Datetime createddate, String name){
            this.id = id;
            this.sobjectname = sobjectname;
            this.icon = icon;
            this.createddate = createddate;
            this.name = name;
        }

        public SearchResult(String id, String sobjectname, String icon, Datetime createddate, String name, String bookmarkid){
            this.id = id;
            this.sobjectname = sobjectname;
            this.icon = icon;
            this.createddate = createddate;
            this.name = name;
            this.bookmarkid = bookmarkid;
        }

        public Integer compareTo(Object compare){
            SearchResult searchResult = (SearchResult) compare;
            Integer result = 0;
            if(name > searchResult.name) result = 1;
            if(name < searchResult.name) result = -1;
            return result;
        }

    }

    //TICKET 2
    @AuraEnabled
    public static Map<String, Object> search(String searchTerm, Integer page){

        // Check for any existing bookmarks
        List<Bookmark__c> bookmarks = [select Id, Record_ID__c, Object__c from Bookmark__c];
        Set<Id> bookmarkedIds = new Set<Id>();
        for(Bookmark__c book : bookmarks){
            bookmarkedIds.add(book.Record_ID__c);
        }

        // Prepare query paramters
        searchTerm += '*';
        System.debug(searchTerm);
        System.debug(page);
        // Execute search query
        List<List<SObject>> searchResults = [FIND :searchTerm IN ALL FIELDS RETURNING
            Account (Id, Name, CreatedDate WHERE id NOT IN :bookmarkedIds),
            Contact (Id, Name, CreatedDate WHERE id NOT IN :bookmarkedIds),
            Lead (Id, Name, CreatedDate WHERE id NOT IN :bookmarkedIds)];

        System.debug(searchResults);

        // Prepare results
        List<SearchResult> allresults = new List<SearchResult>();
        List<SearchResult> pageresults = new List<SearchResult>();

        for(List<SObject> objectList : searchResults){
            if(!objectList.isEmpty()){
                String sobjecttype = objectList.getSObjectType().getDescribe().getLabel();
                for(SObject obj : objectList){
                    allresults.add(new SearchResult((String)obj.get('Id') , sobjecttype, getIconClass(sobjecttype), (DateTime)obj.get('CreatedDate'), (String)obj.get('Name')));
                }
            }
        }
        allresults.sort();
        System.debug(allresults);
        Integer minBound = page * PAGE_SIZE;
        Integer maxBound = (page * PAGE_SIZE) + PAGE_SIZE >= allresults.size() ? allresults.size() : (page * PAGE_SIZE) + PAGE_SIZE;
        if(!allresults.isEmpty()){
            for(Integer i = minBound; i < maxBound; i++){
                pageresults.add(allresults[i]);
            }
        }

        Integer maxPages = Math.ceil(allresults.size() / PAGE_SIZE).intValue();

        Map<String, Object> returnMap = new Map<String, Object>();

        returnMap.put('searchresults', JSON.serialize(pageresults));
        returnMap.put('maxpages', maxPages);

        return returnMap;

    }

    public static String getIconClass(String sobjecttype){
        if(sobjecttype == 'Account'){
            return accountIcon;
        }
        if(sobjecttype == 'Contact'){
            return contactIcon;
        }
        if(sobjecttype == 'Lead'){
            return leadIcon;
        }
        return '';
    }

    //TiCKET 3
    @AuraEnabled
    public static String getBookmarks(){
        
        List<SearchResult> results = new List<SearchResult>();
        Set<Id> bookmarks = new Set<Id>();

        for(Bookmark__c book : [select Id, Record_ID__c from Bookmark__c]){
            bookmarks.add(book.Record_ID__c);
        }

        for(Account acc : [select Id, Name, CreatedDate from Account where Id in :bookmarks]){
            results.add(new SearchResult(acc.Id, 'Account', getIconClass('Account'), acc.CreatedDate, acc.Name));
        }
        for(Contact cont : [select Id, Name, CreatedDate from Contact where Id in :bookmarks]){
            results.add(new SearchResult(cont.Id, 'Contact', getIconClass('Contact'), cont.CreatedDate, cont.Name));
        }
        for(Lead lead : [select Id, Name, CreatedDate from Lead where Id in :bookmarks]){
            results.add(new SearchResult(lead.Id, 'Lead', getIconClass('Lead'), lead.CreatedDate, lead.name));
        }

        return JSON.serialize(results);

    }

    @AuraEnabled
    public static String saveBookmark(String recordId){
        try{
            insert new Bookmark__c(Record_ID__c = recordId);
            return getBookmarks();
        }catch(Exception ex){
            throw new AuraHandledException('Error saving bookmark.');
        }
    }

}