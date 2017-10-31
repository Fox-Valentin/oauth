  <template>
    <div >
      <el-tree
        :data="data2"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :default-checked-keys="checkedData"
        :props="defaultProps"
        :expand-on-click-node="false"
        >
      </el-tree>
      <div class="buttons">
        <el-button @click="submitTreeData">提交</el-button>
      </div>
    </div>
</template>
<script>
import _ from 'lodash'
  export default {
    methods: {
      submitTreeData () {
        let paramsAry = this.$refs.tree.getCheckedKeys()
        this.$http.post('/api/submitTreeData', { params: paramsAry }).then((res) => {
          console.log(res.data.info)
        }, (err) => {
          console.log(err)
        })
      }
    },
    data() {
      return {
        data2: null,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        checkedData: null
      };
    },
    mounted () {
      this.$http.post('/api/getTreeData', {id: 123}).then((res) => {
        this.data2 = res.data
      }, (err) => {
        console.log(err)
      })

      this.$http.post('/api/getTreeCheckedData', {id: 123}).then((res) => {
        this.$refs.tree.setCheckedKeys(res.data.checkedData)
        this.frontId = res.data.frontId
      }, (err) => {
        console.log(err)
      })
    }
  };
</script>
<style scoped>

</style>
