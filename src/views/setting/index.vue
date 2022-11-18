<template>

  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                type="primary"
                size="small"
                @click="showDialog=true"
              >
                新增角色
              </el-button>
            </el-row>
            <el-table border :data="list">
              <el-table-column align="center" type="index" prop="id" label="序号" width="120px" />
              <el-table-column align="center" prop="name" label="名称" width="240px" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="{row}">
                  <!-- <template #row> -->
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editBtn(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delBtn(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <el-row type="flex" justify="end">
              <el-pagination :total="page.total" :page-size="page.pagesize" :current-page="page.page" layout="prev,pager,next" @current-change="currentChange" />
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="公司信息">
            <!-- 右侧内容 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input v-model="formData.companyPhone" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="公司邮箱">
                <el-input v-model="formData.mailbox" style="width:400px" disabled />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" style="width:400px" disabled />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <el-dialog title="编辑角色" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnConfirm">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>

</template>

<script>
import { getRolesLsit, getCompanyInfo, deleteRoule, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  name: 'HrsaasIndex',
  data() {
    return {
      showDialog: false,
      list: [],
      page: {
        // 放置页面及相关信息
        page: 1,
        pagesize: 3,
        total: 0 // 记录总数
      },
      formData: {}, // 公司信息
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },

  computed: {
    ...mapGetters(['companyId'])
  },

  mounted() {
    this.getRolesLsit()
    this.getCompanyInfo()
  },

  methods: {
    async getRolesLsit() {
      const { total, rows } = await getRolesLsit(this.page)
      console.log(rows)
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    currentChange(newChange) {
      this.page.page = newChange
      this.getRolesLsit()
    },
    async delBtn(id) {
      try {
        await this.$confirm('您确认删除？')
        await deleteRoule(id) // 调用删除接口
        this.getRolesLsit() // 重新加载数据
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editBtn(id) {
      this.roleForm = await getRoleDetail(id) // 实现数据的回写
      this.showDialog = true
    },
    async btnConfirm(id) {
      try {
        await this.$refs.roleForm.validate()
        // roleForm有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          // 新增业务
          await addRole(this.roleForm)
        }
        this.getRolesLsit()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      // console.log('触发关闭事件')
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
