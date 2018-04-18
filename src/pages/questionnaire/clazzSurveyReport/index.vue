<template>
  <div class='clazzReportStyle'>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content lessonReportSelectStyle" style='overflow:auto;min-height:470px'>
          
            <el-input size="small" placeholder="关键字" v-model="searchValue" class="input-with-select leftInput" style="width:100%">
              <el-select v-model="searchKey" slot="prepend" placeholder="班级" @change="optionChange()">
                <el-option label="班级" value="clazzName"></el-option>
                <el-option label="教师" value="teacherName"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click='toSearchByKey' style="20px"></el-button>
          </el-input>
          <div class="clear"></div>

         <!-- <el-tree :props="props" :data="loadClazzNode" lazy class='elTree' v-show='flag==1' @node-click='loadClazzNode'></el-tree>
         <el-tree :props="props" :data="loadTeacherNode" lazy class='elTree' v-show="flag==2" @node-click='loadTeacherNode'></el-tree> -->
         <el-tree :data="clazzDate"  :props="defaultProps" accordion @node-click="loadClazzNode" v-show='flag==1' style="background-color:#FAFCFB"> </el-tree>
         <el-tree :data="teacherData" :props="defaultProps"  accordion @node-click="loadTeacherNode" v-show='flag==2' style="background-color:#FAFCFB"> </el-tree>

      </div>
     </el-col>
      <el-col :span="18">
        <div class="grid-content" style='overflow:auto;height:470px'>
           <el-date-picker
            v-model="searchDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style='width:50%;margin-left:120px'>
          </el-date-picker>
        
          <el-button slot="append" icon="el-icon-search" @click.native='toSearchDateByKey' style="margin-left:-10px;background-color:#448DB8;color:white;height:42px"></el-button>  
        <div class="chartDiv" ref='main' id='clazzChartDiv'></div>
        </div>
      </el-col>
      
    </el-row>
  </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
import * as echarts from 'echarts';
  export default {
    data() {
      return {

        flag:1,
        chartDatas:'',
        searchDate:'',
        searchKey:'',
        searchValue:'',
         defaultProps: {
          children: 'children',
          label: 'label'
        },
        teacherData:[],
        clazzDate:[],
        test:null
      
      };
    },
    mounted () {  
      var vm= this;
       //this.init();

       /*
        window.innerHeight：
          1920*1080：1068
          1600*900:867
          1280*720：666
          800*600：532

         */

         //根据分辨率进行自使用高度调节(chart)
       var outerDivs=document.getElementsByClassName('grid-content');
       var clazzChartDiv=document.getElementById('clazzChartDiv');
       for(var i=0;i<outerDivs.length;i++){
          if(window.innerHeight<700){
             outerDivs[i].style.height='510px';
             clazzChartDiv.style.height='370px';
           }else if(window.innerHeight>700 && window.innerHeight<900){
             outerDivs[i].style.height='700px';
             clazzChartDiv.style.height='550px';
           }else if(window.innerHeight>1000){
            outerDivs[i].style.height='870px';
            clazzChartDiv.style.height='700px';
          }
       }
      
        
    },
  //映射数据
  computed:{
   
    
    ...mapGetters(['departments','directions','clazzs_dir','teachers','teachersLessonReport','allClazzLessonReport','allTeas','classes'])
  },
  //初始化数据
  created(){
     //ES6 中去除数组中重复元素的方法
      Array.prototype.remDub = Array.prototype.remDub || function () {
              //return Array.from(new Set(this));
              return [...new Set(this)];
          };


    var self=this;
    //查找所有教师
     this.findAllTeachers_re();
     //查找所有班级
     this.findAllClasses();

    //查找所有一级部门,默认加载教师的一级菜单
    this.findAllDepartments().then(()=>{
      this.departments.forEach(function(depItem){
          var obj={
            label:depItem.name,
            depId:depItem.id,
            children:[{}]
          };

          self.teacherData.push(obj);
        });//forEach--

    });
    //查找所有二级方向,默认加载班级的一级菜单
    this.findAllDirections().then(()=>{
      this.directions.forEach(function(dirItem){
          var obj={
            label:dirItem.name,
            dirId:dirItem.id,
            children:[{}]
          };

          self.clazzDate.push(obj);//当前clazzDate包含所有方向
        });//forEach--

      
    });//findAllDir
  },
    methods: {
      //日期搜索
      toSearchDateByKey(){
        var self=this;
      
       
        if(!this.searchKey){
          this.searchKey='clazzName';
        }

        if(this.searchKey=='clazzName'){
          if(this.chartDatas){
            this.chartDatas=this.chartDatas.split('班')[0];
           var currentClazz= this.classes.filter(function(item){
              return item.name==self.chartDatas
            });
           var o={
            clazzId:currentClazz[0].id,
            clazzName:currentClazz[0].name
           };
           this.loadClazzNode(o);
        }

      
       }else{
          if(this.chartDatas){
           this.chartDatas=this.chartDatas.split('老')[0];
           var currentTeacher=this.allTeas.filter(function(item){
            return item.realname==self.chartDatas
           });

            var o={
              teaId:currentTeacher[0].id,
              label:currentTeacher[0].realname
            };
            this.loadTeacherNode(o);
           
         }
      }
       

      },
      loadClazzNode(data){
        var vm=this;
        if(data.dirId){//点击方向-》拿到当前方向下的所有班级
           var paramData={
              departid:data.dirId
            }
          this.findAllClazzByDirId(paramData).then(()=>{
          if(this.clazzs_dir.length>0){//此时代表当前方向下存在班级
            data.children=[];//先将默认的数据{}清空
            data.children.length=this.clazzs_dir.length;//第二次点击以及以后点击，不能重复添加子元素
             this.clazzs_dir.forEach(function(clazzItem){
              var obj={
                clazzId:clazzItem.id,
                label:clazzItem.name
              };
             
              data.children.push(obj);
             });
            //console.log(data,'存在班级---');
          }else{//此时当前方向下没有班级，eg:市场部,但是给市场部做课调的班级一定属于某个方向，所以此时用户可以选择方向
               data.children=[];
             this.$message({type: 'info', message: '当前方向没有班级'});
           // console.log(data,'没有班级---');
            /*var clazzZxData={
                  titleName:data.label+' 没有班级'
                }
              this.init(clazzZxData,[]);*/
          }
          

          });

        }else if(data.clazzId){//当前点击为某个班级
         
           //根据点击的班级id获取当前班级中所有任课教师的课调(包括课调平均分，课调时间，课调内容等)
            var paramData={
              clazzid:data.clazzId
            }

            //根据班级id获取当前班级下的所有教师课调信息
            this.findAllTeachersLessonReport(paramData).then(()=>{
              //console.log(this.teachersLessonReport);
              var allReps=this.teachersLessonReport.allTeacherlessonReports;
              if(allReps.length>0){//此时代表当前班级有教师课调信息
                //console.log(allReps,'---00000');
                 var names=data.label?data.label:data.clazzName;
                var zhxTeacherData={
                  titleName:names+'班 所有教师平均分',
                  TeacherNameArr:[],//显示折现样式第一行
                  xData:[]//x轴显示的数据
                }
                //声明x轴显示的数据
                var xData=[];
                //声明折现完成的最后数组
                var seriesArr=[];
               
                allReps.forEach(function(teaItem,teaIndex,teaArr){
                  //teaItem 代表每一个教师  teaItem.lessonReport 代表当前教师的所有课调Arr
                  zhxTeacherData.TeacherNameArr.push(teaItem.name);
                 
                  
                 
                
                  
                  if(vm.searchDate){
                      var today=new Date(vm.searchDate[0]).getTime();
                  }else{
                      var today=new Date(new Date().getFullYear()-1+'-7-1').getTime();
                  }
                 var filterReports= teaItem.lessonReport.filter(function(item){
                      return new Date(item.date).getTime()>=today
                    });
                 

                  
                  
                 filterReports.forEach(function(tResItem,tResIdex,tResArr){
                    //tResItem 代表老师的每一份课调
                    var dd=tResItem.date.slice(0,10).split('-').join('/');
                    xData.push(dd);

                    if(teaIndex==teaArr.length-1 && tResIdex==tResArr.length-1){
                      zhxTeacherData.xData=xData.remDub().sort();//x轴显示数据去重排序完成
                      

                      //当用户选择了时间之后，进行x轴数据的更改，由于下面数据的匹配也是经过和x轴数据的匹配，所以不用更改数据的时间
                        var newgg=[];
                        if(vm.searchDate){
                         zhxTeacherData.xData.forEach(function(item){
                          if(new Date(item).getTime()>=vm.searchDate[0].getTime() && new Date(item).getTime()<=vm.searchDate[1].getTime()){
                            newgg.push(item);
                          }
                         });
                          zhxTeacherData.xData=newgg;
                        }


                        
                    
                            //重新遍历所有教师以及教师的所有课调，进行课调时间的匹配，做出平均分数组
                              allReps.forEach(function(it,ins){
                                //声明每一个教师显示的平均分数组
                                var averageArr=[];
                                 var filtReports= it.lessonReport.filter(function(item){
                                    return new Date(item.date).getTime()>today
                                  });
                                filtReports.forEach(function(ite,ind){
                                  var dds=ite.date.slice(0,10).split('-').join('/');
                                  // console.log(zhxTeacherData.xData,'内层打印去重数组----');
                                  //averageArr.length=zhxTeacherData.length;
                                  for(var i=0;i<zhxTeacherData.xData.length;i++){
                                   // console.log(zhxTeacherData.xData[i]);
                                    if(dds==zhxTeacherData.xData[i]){
                                      averageArr[i]=ite.average;
                                    }else{
                                      if(!averageArr[i]){
                                        averageArr[i]=null;
                                      }
                                    }
                                  }

                                  
                                });
                                //console.log(averageArr,'平均分数据---');
                                 var realDataObj={
                                  name:it.name,
                                  type:'line',
                                  markLine: {
                                    data: [
                                        {type: 'average', name: '平均值'},
                                        [{
                                            symbol: 'none',
                                            x: '90%',
                                            yAxis: 'max'
                                        }, {
                                            symbol: 'circle',
                                            label: {
                                                normal: {
                                                    position: 'start',
                                                    formatter: '最大值'
                                                }
                                            },
                                            type: 'max',
                                            name: '最高点'
                                        }]
                                    ]
                                }
                                 
                                };

                                realDataObj.data=averageArr;
                                seriesArr.push(realDataObj);
                                //console.log(zhxTeacherData.xData);
                              });

                              
                       
                    }
                    

                    
                  });

                });
                var startD=new Date().getFullYear()-1+'年7月-';
                var endD=(new Date(zhxTeacherData.xData[zhxTeacherData.xData.length-1]).getFullYear())+'年'+(new Date(zhxTeacherData.xData[zhxTeacherData.xData.length-1]).getMonth()+1)+'月';
             

                
                zhxTeacherData.dateStart=this.searchDate?new Date(this.searchDate[0]).getFullYear()+'年'+(new Date(this.searchDate[0]).getMonth()+1)+'月-':startD;
                zhxTeacherData.dateEnd=this.searchDate?new Date(this.searchDate[1]).getFullYear()+'年'+(new Date(this.searchDate[1]).getMonth()+1)+'月':endD;

                this.init(zhxTeacherData,seriesArr);
               


               // console.log(zhxTeacherData.xData,'0-0--0-0-');




              }else{//当前班级没有教师的课调信息
                 this.$message({type: 'info', message: '当前班级没有教师课调信息'});
               /* var names=data.label?data.label:data.clazzName;
                var clazzZxData={
                  titleName:names+'班 没有教师做过课调'
                }
                this.init(clazzZxData,[]);*/
               }
                
            });//then()结束

        }
         
          
        
      },
      loadTeacherNode(data){
        var vm=this;
         //根据当前点击的部门id，查找出当前部门的所有方向
          this.findAllDirections().then(()=>{
            var allDirs=this.directions.filter(function(item){
              //查出所有部门，根据所有部门中的belongName进行过滤，将当前点击部门下的所有方向进行显示
              return item.belongName==data.label;
            });

            if(data.depId){//当前点击的为部门，加载当前部门下的所有方向
              if(allDirs.length>0){//当前点击的部门下有 方向
                data.children=[];//现将默认的{}进行清空，{}为了显示树形结构
                data.children.length=allDirs.length;//避免二次点击重复添加节点
                allDirs.forEach(function(dirItem){
                  var obj={
                    label:dirItem.name,
                    dirId:dirItem.id,
                    children:[]
                  };
                  data.children.push(obj);
                });



              }else{//当前点击的部门下没有方向 eg：市场部，根据方向id查找出当前方向所有教师
                  
                  this.findAllTeachers_re().then(()=>{//查找所有教师进行筛选符合当前点击部门的

                  var thisTeas=this.allTeas.filter(function(item){
                    if(item.department){
                      return item.department.name==data.label;
                    }
                   
                  });
                  if(thisTeas.length>0){
                    data.children.length=thisTeas.length;
                    thisTeas.forEach(function(item){
                       var o={
                        label:item.realname,
                        teaId:item.id
                      }
                      data.children.push(o);
                    });
                  }
                  


                })
              

              }
            }else if(data.dirId){//当前点击为方向，查找当前方向下的所有教师进行前台筛选

                this.findAllTeachers().then(()=>{
                var allTeas=this.teachers.filter(function(item){

                  return item.department.name==data.label;
                });

                if(allTeas.length>0){//当前方向下存在教师
                  data.children.length=allTeas.length;
                  allTeas.forEach(function(item){
                    var o={
                      label:item.realname,
                      teaId:item.id
                    }
                    data.children.push(o);
                  });

                }else{
                  //当前方向下没有教师 
                   this.$message({type: 'info', message: '当前方向下没有教师'});
                   /*var teacherZxData={
                      titleName:data.label+' 没有教师'
                    }
                    this.init(teacherZxData,[]);*/
                }
              });

            }else if(data.teaId){//当前点击的为某个教师，根据教师id获取当前教师所对应的所有班级的课调信息
              var paramData={
                teacherid:data.teaId
              }

              this.findAllClazzLessonReport(paramData).then(()=>{
                
                if(this.allClazzLessonReport.allTeacherlessonReports.length>0){//当前教师存在对班级做课调的信息
                  //console.log(this.allClazzLessonReport,'this.allClazzLessonReport----当前教师所对应的所有班级尅到');
                  var teaNames=data.label?data.label:data.teaName;
                  var teacherZxData={
                    titleName:teaNames+'老师 所有课调信息',
                    TeacherNameArr:[],
                    xData:[]
                  };

                 
                    //声明x轴需要的数据数组，作为临时保存，之后进行去重排序之后再进行赋值传递
                    var xData=[];
                    //声明折线图上最后数据所需要的数组 数组中包含对象，对象中包含data折现数据
                    var seriesArr=[];

                  var allTeaRe=this.allClazzLessonReport.allTeacherlessonReports;
                  allTeaRe.forEach(function(clReitem,clReindex,clRearr){
                   
                    teacherZxData.TeacherNameArr.push(clReitem.name);

                    //将各个班级只能够所有课调信息进行过滤，只取当前年份前一年七月份到现在最新一次课调时间的
                     if(vm.searchDate){
                        var today=new Date(vm.searchDate[0]).getTime();
                    }else{
                        var today=new Date(new Date().getFullYear()-1+'-7-1').getTime();
                    }
                 
                   var filterReports=clReitem.lessonReport.filter(function(item){
                    return new Date(item.date).getTime()>today;
                   });

                   
                    
                    //拿到过滤之后的所有课调信息，形成x轴数组
                   filterReports.forEach(function(item,index,arr){
                      var dd=item.date.slice(0,10).split('-').join('/');
                      xData.push(dd);
                      //只获取最后一次遍历的结果
                      if(clReindex==clRearr.length-1 && index==arr.length-1){
                        teacherZxData.xData=xData.remDub().sort();
                        


                        //当用户选择了时间之后，进行x轴数据的更改，由于下面数据的匹配也是经过和x轴数据的匹配，所以不用更改数据的时间
                        var newgg=[];
                        if(vm.searchDate){
                         teacherZxData.xData.forEach(function(item){
                          if(new Date(item).getTime()>=vm.searchDate[0].getTime() && new Date(item).getTime()<=vm.searchDate[1].getTime()){
                            newgg.push(item);
                          }
                         });
                          teacherZxData.xData=newgg;
                        }



                        //为了拿到最后的x轴数，进行二次遍历
                        allTeaRe.forEach(function(item){
                         
                          
                           var filtReports=item.lessonReport.filter(function(it){
                            return new Date(it.date).getTime()>today;
                           });

                           //创建折现数据，有几个班级的课调信息，创建几个对象
                           var realDataObj={
                                    name:item.name,
                                    type:'line',
                                    markLine: {
                                      data: [
                                          {type: 'average', name: '平均值'},
                                          [{
                                              symbol: 'none',
                                              x: '90%',
                                              yAxis: 'max'
                                          }, {
                                              symbol: 'circle',
                                              label: {
                                                  normal: {
                                                      position: 'start',
                                                      formatter: '最大值'
                                                  }
                                              },
                                              type: 'max',
                                              name: '最高点'
                                          }]
                                      ]
                                  }
                                   
                                  };


                           //声明存放折现上数据的数组，每个班级一个数组，并且根据x轴数据进行比对，比对成功后进行整体数据的封装
                           var newArr=[];
                           filtReports.forEach(function(re){
                            var dds=re.date.slice(0,10).split('-').join('/');
                            newArr.length=teacherZxData.xData.length;
                            for(var h=0;h<teacherZxData.xData.length;h++){
                              if(dds==teacherZxData.xData[h]){
                                newArr[h]=re.average;
                              }else{
                                if(!newArr[h]){
                                  newArr[h]=null;
                                }
                              }
                            }
                           

                           });

                           realDataObj.data=newArr;

                           //console.log(newArr,'每个班级的折现数组--');
                           //console.log(realDataObj);
                           seriesArr.push(realDataObj);

                        });
                      }
                    
                   });
                 


                  });

                  //设置第二标题的时间显示
               

                  var startD=new Date().getFullYear()-1+'年7月-';
                  var endD=(new Date(teacherZxData.xData[teacherZxData.xData.length-1]).getFullYear())+'年'+(new Date(teacherZxData.xData[teacherZxData.xData.length-1]).getMonth()+1)+'月';


                  teacherZxData.dateStart=this.searchDate?new Date(this.searchDate[0]).getFullYear()+'年'+(new Date(this.searchDate[0]).getMonth()+1)+'月-':startD;
                  teacherZxData.dateEnd=this.searchDate?new Date(this.searchDate[1]).getFullYear()+'年'+(new Date(this.searchDate[1]).getMonth()+1)+'月':endD;
                  this.init(teacherZxData,seriesArr);

                }else{//当前教师不存在对班级做课调的信息
                  /*var teaNames=data.label?data.label:data.teaName;
                    var teacherZxData={
                      titleName:teaNames+'老师 没有班级课调信息'
                    }
                    this.init(teacherZxData,[]);*/
                     this.$message({type: 'info', message: '当前教师不存在课调信息'});
                }
              });

            }//else if()

            
            
          });
      },
      optionChange(){
        //根据下拉框所选择的数据更改flag值
        
        if(this.searchKey=='clazzName'){
          this.flag=1;
          //用户选择为班级
        }else{
          this.flag=2;
              //当前用户选择为教师
        }
      },
      toSearchByKey(){
        var vm=this;
        //根据用户输入关键字以及选择进行显示
        if(!this.searchKey){
          this.searchKey='clazzName';
        }
        var searchObj={
          param:this.searchKey,
          value:this.searchValue
        }
        if(this.searchKey=='clazzName'){
            this.findAllClasses().then(()=>{
           var a= this.classes.filter(function(item){
             return item.name.indexOf(vm.searchValue)!=-1;
              
            });
           if(a.length==1){
             var obj={
                teaId:''
              }
            a.forEach(function(item){
             obj.clazzId=item.id;
             obj.clazzName=item.name;
            });
            this.loadClazzNode(obj);
           }else{
            //console.log('出现重名的班级或者没有输入查询内容----');
             this.$message({type: 'info', message: '出现重名班级或者没有匹配成功'});
           }



          });
           

        }else{
          this.findAllTeachers_re().then(()=>{
           var a= this.allTeas.filter(function(item){
             return item.realname.indexOf(vm.searchValue)!=-1;
              
            });
           if(a.length==1){
             var obj={
                teaId:''
              }
            a.forEach(function(item){
             obj.teaId=item.id;
             obj.teaName=item.realname;
            });
            this.loadTeacherNode(obj);
           }else{
            console.log('出现重名的教师或者没有输入查询内容----');
            this.$message({type: 'info', message: '出现重名教师或者没有匹配成功'});
           }



          });
           
        }

     
      },
      init(zhxData,realData){
        
        var chartThis=this;
        var myChart = echarts.init(chartThis.$refs.main);
        var option = {
        title: {
            text: zhxData.titleName,
            subtext: zhxData.dateStart+zhxData.dateEnd,

        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:zhxData.TeacherNameArr //显示多个教师/班级的颜色以及样式，在第一行
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: zhxData.xData
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} 分'
            }
        },
        series:realData//折现图的数据
    };

    myChart.clear();//解决画布缓存问题，每次调用之前先进行清空
    myChart.setOption(option);
    this.chartDatas=myChart._model.option.title[0].text;//为按照日期搜索获取当前已经进行展示的图标的信息进行切割获取

      },
      //vuex映射的动作
  ...mapActions([
    'findAllDepartments',
    'findAllDirections',
    'findAllClazzByDirId',//根据方向id查找当前方向下的所有班级
    'findAllTeachers',
    'findAllTeachersLessonReport',
    'findAllClazzLessonReport',
    'findAllTeachers_re',
    'findAllClasses'
    
  ])
    }
  };
</script>


<style>



 .clazzReportStyle .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
 .clazzReportStyle .el-col {
    border-radius: 4px;
  /* border:1px solid #CCCCCC;
  padding:20px; */

  }
 
  .clazzReportStyle .grid-content {
    border-radius: 4px;
    border:1px solid #CCCCCC;
    padding:20px;
   /*  min-height: 480px; */
   /*  overflow:auto; */

  }
  .row-bg {
    padding: 10px 0;
   /*  background-color: #f9fafc; */
  }
  .clear{
    clear:left;
    height:15px;
  }
  .elTree{
    /* background-color:#FAFCFB; */

    margin-top:20px;
  }
  .lessonReportSelectStyle .input-with-select{
  margin-right:10px;
  width: 230px;
  float: left
  }
  /* .leftInput{
    width:120%
  } */
    .lessonReportSelectStyle .el-select{
  width: 75px;

}

.chartDiv{
  width: 100%;
  /* height:600px; */
  display:inline-block;
  margin-top:70px;
}

  .lessonReportSelectStyle .el-input__inner{
    border:1px solid #448db8;
  }
    .lessonReportSelectStyle .el-input__inner::placeholder{
    color: white;
  }
    .lessonReportSelectStyle .el-input-group__append, .el-input-group__prepend{
    color: white;
    background-color: #448db8;
    border:none;
  }
    .lessonReportSelectStyle .el-select .el-input .el-select__caret{
    color:white;
  }


</style>

