var weibo255 = new Vue({
  el: '#vue-home',
  data: {
    ruleForm: {
      question: '',
      answer_a: '',
      answer_b: '',
      answer_c: '',
      answer_d: '',
      correct_answer: '',
      link: ''
    },
    activeIndex: 'register',
    pageContent: 'register',
    tableData: [],
    tableData2: [],
    fullscreenLoading: false,
    keyword: '',
    rules: {
      question: [{
        required: true,
        message: '请输入问题',
        trigger: 'blur'
      }],
      answer_a: [{
        required: true,
        message: '请输入选项内容',
        trigger: 'blur'
      }],
      answer_b: [{
        required: true,
        message: '请输入选项内容',
        trigger: 'blur'
      }],
      answer_c: [{
        required: true,
        message: '请输入选项内容',
        trigger: 'blur'
      }],
      answer_d: [{
        required: true,
        message: '请输入选项内容',
        trigger: 'blur'
      }],
      correct_answer: [{
        required: true,
        message: '请输入答案',
        trigger: 'blur'
      }],
      link: [{
        required: true,
        message: '请输入链接',
        trigger: 'blur'
      }]
    }

  },
  mounted: function() {
    // this.getAllUserData();
  },
  methods: {
    handleSelect: function(key, keyPath) {
      var that = this;
      this.pageContent = key;
      if(key == 'list'){
        // this.getAllUserData();
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

      if(this.ruleForm.question && this.ruleForm.answer_a && this.ruleForm.answer_b && this.ruleForm.answer_c && this.ruleForm.answer_d && this.ruleForm.correct_answer && this.ruleForm.link) {
        if(this.ruleForm.correct_answer == 'A' || this.ruleForm.correct_answer == 'B' || this.ruleForm.correct_answer == 'C' || this.ruleForm.correct_answer == 'D'){
          this.fullscreenLoading = true;
          axios.post(config.host + '/save_question', {
            question: that.ruleForm.question,
            answer_a: that.ruleForm.answer_a,
            answer_b: that.ruleForm.answer_b,
            answer_c: that.ruleForm.answer_c,
            answer_d: that.ruleForm.answer_d,
            correct_answer: that.ruleForm.correct_answer,
            link: that.ruleForm.link
          }).then(function(res) {
            that.fullscreenLoading = false;
            layer.open({
              content: '信息添加成功！',
              skin: 'msg',
              time: 2
            });
            that.ruleForm.question = '';
            that.ruleForm.answer_a = '';
            that.ruleForm.answer_b = '';
            that.ruleForm.answer_c = '';
            that.ruleForm.answer_d = '';
            that.ruleForm.correct_answer = '';
            that.ruleForm.link = '';

          })
        }else{
          layer.open({
            content: '答案输入格式不对，请检查(⊙o⊙)',
            skin: 'msg',
            time: 2
          });
        }

      } else{
        layer.open({
          content: '您还有未填写的信息(⊙o⊙)',
          skin: 'msg',
          time: 2
        });
      }

    }
  }
})
