const axios = require('axios');
const parser = require('fast-xml-parser');

module.exports = {
    ax: null,
    sid: null,
    
    init: function(dreamboxHost) {
        this.ax = axios.create({
            baseURL: 'http://'+dreamboxHost+'/web'
        });
        return this.request('/session').then((ret) => {
            this.sid = ret.e2sessionid;
        });
    },

    request: function(request) {
        console.log(request);
        return this.ax.get(request).then((ret) => {
            return parser.parse(ret.data)
        });
    },

    getBouquets: function() {
        return this.request('/getservices?sessionid='+this.sid).then((ret) => {
            return ret.e2servicelist;
        });
    },

    getServices: function(refBouquet) {
        return this.request('/getservices?sessionid='+this.sid+'&sRef='+refBouquet).then((ret) => {
            return ret.e2servicelist;
        });
    }    
};