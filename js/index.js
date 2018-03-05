var weibo255 = new Vue({
  el: '#vue-home',
  data: {
    ruleForm: {
      question: '',
      currentId: '',
      pageUrl: ''
    },
    activeIndex: 'list',
    pageContent: 'list',
    tableData: [],
    tableData2: [],
    fullscreenLoading: false,
    keyword: '',
    rules: {
      originId: [{
        required: true,
        message: '请输入原微博号',
        trigger: 'blur'
      }],
      currentId: [{
        required: true,
        message: '请输入新微博号',
        trigger: 'blur'
      }],
      pageUrl: [{
        required: true,
        message: '请输入新微博号',
        trigger: 'blur'
      }]
    }

  },
  mounted: function() {
    this.getAllUserData();
  },
  methods: {
    handleSelect: function(key, keyPath) {
      var that = this;
      this.pageContent = key;
      if(key == 'list'){
        this.getAllUserData();
      }
      console.log(key, keyPath);
    },
    getAllUserData: function() {
      var that = this;
      this.fullscreenLoading = true;
      this.tableData = [];
      axios.get(config.host + '/all_users').then(function(res) {
        that.fullscreenLoading = false;
        for (let i = 0; i < res.data.data.length; i++) {
          var tempData = {
            originId: res.data.data[i].originId,
            currentId: res.data.data[i].currentId,
            pageUrl: res.data.data[i].pageUrl
          }
          that.tableData.push(tempData)
        }
      })
    },

    clickSearch: function() {
      var that = this;
      this.fullscreenLoading = true;
      this.tableData2 = [];
      axios({
        method: 'get',
        url: config.host + '/search_user',
        params: {
          keyword: that.keyword
        }
        // withCredentials: true
      }).then(function(res) {
        that.fullscreenLoading = false;
        for (let i = 0; i < res.data.data.length; i++) {
          var tempData = {
            originId: res.data.data[i].originId,
            currentId: res.data.data[i].currentId,
            pageUrl: res.data.data[i].pageUrl
          }
          that.tableData2.push(tempData)
        }
      });
    },
    openPageUrl: function(pageUrl) {
      window.location.href = pageUrl;
    },
    submitInfo: function() {
      var that = this;

      if (this.ruleForm.originId && this.ruleForm.currentId && this.ruleForm.pageUrl) {
        this.fullscreenLoading = true;
        axios.post(config.host + '/save_userinfo', {
          originId: that.ruleForm.originId,
          currentId: that.ruleForm.currentId,
          pageUrl: that.ruleForm.pageUrl
        }).then(function(res) {
          that.fullscreenLoading = false;
          layer.open({
            content: '信息添加成功！祝微博生活继续欢乐',
            skin: 'msg',
            time: 2
          });
          that.ruleForm.originId = '';
          that.ruleForm.currentId = '';
          that.ruleForm.pageUrl = '';

        })
      } else{
        layer.open({
          content: '您还有未填写的信息(⊙o⊙)哦',
          skin: 'msg',
          time: 2
        });
      }

    }
  }
})
