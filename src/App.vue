<template>
  <div id="app">
    <div>
      <el-button @click="dialogFormVisible = true">批量生成地址</el-button>
    </div>
    <div class="table-style">
      <h2 class="name">地址列表</h2>
      <div>
        <el-table
          :data="tableData.list"
          border
          style="width: 100%">
          <el-table-column
            prop="complete"
            label="完成数量"
            >
          </el-table-column>
          <el-table-column
            prop="createdAt"
            label="生成时间"
            >
          </el-table-column>
          <el-table-column
            prop="total"
            label="生成总数"
          >
          </el-table-column>
          <el-table-column
            prop="tokenType"
            label="token类型"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
              <!--<el-button  @click="handleClick(scope.row.id)" type="text" size="small" :loading="scope.row.complete < scope.row.total">下载</el-button>-->
              <a :loading="scope.row.complete < scope.row.total" target="_blank" :href="urlData + '/order/mission/' + scope.row.id">下载</a>
              <el-button style="margin-left:20px;" @click="deleteHandler(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin:10px auto;">
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="tableData.total">
          </el-pagination>
        </div>
      </div>
      <el-row>
        <el-col :span="8">
          <el-slider
            v-model="newFee.fee"
            :min="0.0000252"
            :max="0.002016"
            :step="0.000001"
            >
          </el-slider>
        </el-col>
        <el-col :span="3" ><span style="line-height: 35px;padding-left:30px;">Fee: {{newFee.fee ? newFee.fee.toFixed(8) : 0}}</span></el-col>
        <el-col :span="4">
          <el-button @click="putFeeHandler">修改Fee</el-button>
        </el-col>
      </el-row>
      <div style="margin-top:20px;">
        <el-upload
          style="margin-top:20px;"
          :on-success="successFun"
          :on-error="errorFun"
          :action="urlData + '/order/sign'"
          :limit="1"
          list-type="picture">
          <el-button type="primary" >导入待签名交易</el-button>
        </el-upload>
      </div>
      <h2 class="name">签名列表</h2>
      <div>
        <el-table
          :data="signTableData.list"
          border
          style="width: 100%">
          <el-table-column
            type="expand"
          >
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item :key="k" :label="v.tokenType" v-for="(v, k) in props.row.totalBalance">
                  <span>{{ v.total }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="complete"
            label="完成数量"
          >
          </el-table-column>
          <el-table-column
            prop="createdAt"
            label="生成时间"
          >
          </el-table-column>
          <el-table-column
            prop="total"
            label="生成总数"
          >
          </el-table-column>

          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" :loading="scope.row.complete < scope.row.total">
                <a target="_blank" :href="urlData + '/order/sign/' + scope.row.id">下载</a>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin:10px auto;">
          <el-pagination
            @current-change="handleCurrentChange1"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="signTableData.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog width="300px" title="批量生成地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="生成数量">
          <el-input v-model="form.number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="token类型">
          <el-input v-model="form.tokenType" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="createAddress">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'app',
    computed: {
      ...mapGetters({
        tableData: 'tableData',
        signTableData: 'signTableData',
        feeData: 'feeData'
      })
    },
    watch: {
      'newFee.fee': function(v) {
        this.newFee.gasPrice = parseInt(v / this.feeData.gasLimit * 1000000000000000000)
      }
    },
    methods: {
      deleteHandler(n) {
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('getDelete', n).then(() => {
            this.getAddressFun('pageSize=10&pageNum=1&orderBy=created_at desc')
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch((err) => {
            this.$message({
              type: 'error',
              message: err
            })
          })
        }).catch(() => {
        })
      },
      successFun(s) {
        if (s.code !== 200) {
          this.$message.error(`上传失败${s.message}`)
        } else {
          window.setInterval(() => {
            this.durationTime--
            if (this.durationTime === -1) {
              window.history.go(0)
            }
          }, 1000)
          this.$message.success({
            message: '上传成功,3秒后刷新页面',
            duration: 3000
          })
        }
      },
      errorFun() {
        this.$message.error('上传失败')
      },
      putFeeHandler() {
        this.$store.dispatch('putFee', this.newFee).then(() => {
          this.$message.success('修改成功')
        }).catch()
      },
      handleCurrentChange(v) {
        this.getAddressFun(`pageSize=10&pageNum=${v}&orderBy=created_at desc`)
      },
      handleCurrentChange1(v) {
        this.getSignTableHandler(`pageSize=10&pageNum=${v}&orderBy=created_at desc`)
      },
      handleClick(row) {
        this.$store.dispatch('getDownAddress', row).then().catch()
      },
      getAddressFun(str) {
        this.$store.dispatch('getAddressTable', str).then(() => {
        }).catch(() => {
        })
      },
      createAddressFun(opt) {
        this.loading = true
        if (!opt.tokenType.trim() || !opt.number) {
          this.$message.error('请正确填写生成地址信息')
          return
        }
        this.$store.dispatch('getCreateAddress', opt).then(() => {
          this.dialogFormVisible = false
          this.loading = false
          this.form.number = ''
          this.form.tokenType = ''
          this.getAddressFun('pageSize=10&pageNum=1&orderBy=created_at desc')
        }).catch(() => {
          this.loading = false
        })
      },
      createAddress() {
        this.createAddressFun(this.form)
      },
      getSignTableHandler(opt) {
        this.$store.dispatch('getSignTable', opt).then(() => {
        }).catch(() => {
        })
      }
    },
    mounted() {
      const that = this
      this.getAddressFun('pageSize=10&pageNum=1&orderBy=created_at desc')
      this.getSignTableHandler('pageSize=10&pageNum=1&orderBy=created_at desc')
      this.$store.dispatch('getFee').then(() => {
        window.Object.assign(that.newFee, that.feeData)
      }).catch()
    },
    data() {
      return {
        pageNum: 1,
        loading: false,
        durationTime: 3,
        dialogFormVisible: false,
        form: {
          number: '',
          tokenType: ''
        },
        urlData: window.urlData.url,
        newFee: {}
      }
    }
  }
</script>

<style lang="scss">
  @import '~normalize.css/normalize.css';
  // normalize.css 样式格式化
  @import './styles/index.scss'; // 全局自定义的css样式
</style>
