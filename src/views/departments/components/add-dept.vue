<template>
  <div>
    <!-- 放置弹层组件 -->
    <el-dialog title="新增部门" :visible="showDialog">
      <!-- 表单数据label-width设置所有标题的宽度 -->
      <el-form :model="formData" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="部门名称">
          <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item prop="code" label="部门编码">
          <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item prop="manager" label="部门负责人">
          <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" />
        </el-form-item>
        <el-form-item prop="introduce" label="部门介绍">
          <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :row="3" />
        </el-form-item>
      </el-form>
      <!-- 确定和取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary">确定</el-button>
          <el-button size="small">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
export default {
  name: 'HrsaasAddDept',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },

  data() {
    // 检查部门名称是否重复
    const checkNameRepet = async(rule, value, callback) => {
      // value是部门名称 要去和同级部门下的部门去比较  有相同的不可以过 没有相同的可以过
      const { depts } = await getDepartments()
      // 去找同级部门下 有没有和value相同的数据
      // 找到所有子部门
      const isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      // 如果isRepeat为true 表示找到了一样的名字
      isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // 要求编码和所有部门编码都不能重复
      // 由于历史数据有可能没有code 可以加一个强制性条件  value值不为空
      const isRepeat = depts.some(item => item.code === value && value)
      isRepeat ? callback(new Error(`组织架构中已经存在这个${value}编码了`)) : callback()
    }
    return {
      // 定义一个表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepet }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码长度为1-50个字符', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门介绍长度为1-300个字符', trigger: 'blur' }]
      } // 校验规则{key：数组}
    }
  },

  mounted() {

  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>