<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form ref="userData" :model="formData" :rules="rules" label-width="120px">
              <el-form-item prop="username" label="姓名:">
                <el-input v-model="formData.username" />
              </el-form-item>
              <el-form-item prop="password2" label="密码:">
                <el-input v-model="formData.password2" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- <user-info /> -->
            <!-- 动态组件 可以切换组件 is必须是变量 举个例子-->
            <!-- <el-button type="primary" @click="UserComponent='el-table'">切换组件</el-button>
              <el-button type="primary" @click="UserComponent='UserInfo'">切换组件1</el-button> -->
            <!-- vuejs总内置了一个组件 component 可以是任何组件 -->
            <component :is="UserComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- <job-info /> -->
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="JobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'

export default {
  name: 'HrsaasDetail',
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      UserComponent: 'UserInfo',
      JobComponent: 'JobInfo',
      userId: this.$route.params.id, // 直接将路由中的参数赋值给data中的属性
      formData: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度6-15位', trigger: 'blur' }
        ]
      }
    }
  },

  mounted() {
    this.getUserDetailById()
  },

  methods: {
    async getUserDetailById() {
      this.formData = await getUserDetailById(this.userId)
    },
    async saveUser() {
      try {
        await this.$refs.userData.validate()
        await saveUserDetailById({ ...this.formData, password: this.formData.password2 })
        this.$message.success('更新成功')
        this.getUserDetailById()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tab-pane{
  font-size: 18px;
}
.el-form{
  margin-top: 40px;
.el-form-item{
  width: 400px;
  margin-top: 20px;
  margin-left: 110px;
}

}

</style>
