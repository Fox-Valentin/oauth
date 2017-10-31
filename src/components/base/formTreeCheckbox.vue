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
        v-loading="loading"
        :expand-on-click-node="false"
        :render-content="renderContent"
        @check-change="handleCheckChange"
        >
      </el-tree>
      <div class="buttons">
        <el-button @click="getCheckedNodes">通过 node 获取</el-button>
        <el-button @click="getCheckedKeys">通过 key 获取</el-button>
        <el-button @click="setCheckedNodes">通过 node 设置</el-button>
        <el-button @click="setCheckedKeys">通过 key 设置</el-button>
        <el-button @click="resetChecked">清空</el-button>
        <el-button @click="testFn">testFn</el-button>
        <el-button @click="testFn2">getChecked</el-button>
        <el-button @click="testFn3">提交</el-button>
      </div>
      <pre>
        {{ showData }}
      </pre>
    </div>
</template>
<script>
import _ from 'lodash'
  export default {
    methods: {
      getCheckedNodes() {
        this.showData = this.$refs.tree.getCheckedNodes()
      },
      getCheckedKeys() {
        this.showData = this.$refs.tree.getCheckedKeys()
        console.log(this.showData)
      },
      setCheckedNodes() {
        this.$refs.tree.setCheckedNodes([{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 9,
          label: '三级 1-1-1'
        }]);
      },
      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([3]);
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      testFn () {
        this.loading = true
        let keys = this.$refs.tree.getCheckedKeys()
        let params = {
          keys : keys
        }
        this.$http.post('/api/getTreeData', params).then((res) => {
          this.data2 = res.data
          this.loading = false
        }, (err) => {
          console.log(err)
        })
      },
      testFn2 () {
        this.$refs.tree.setCheckedKeys([1,4,5,9])
      },
      renderContent(h, { node, data, store }) {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span style="float: right; margin-right: 20px">
              <el-button size="mini" on-click={ () => this.append(store, data) }>Append</el-button>
              <el-button size="mini" on-click={ () => this.remove(store, data) }>Delete</el-button>
            </span>
          </span>);
      },
      append(store, data) {
        let id = this.frontId
        store.append({ id: id++, label: 'testtest', children: [] }, data);
      },
      remove(store, data) {
        store.remove(data);
      },
      testFn3 () {
        let tempAry = this.$refs.tree.getCheckedKeys()
        let paramsAry = _.difference(this.oldCheckedData, tempAry)
        console.log(tempAry)
        this.$http.post('/api/submitTreeData', { params: paramsAry }).then((res) => {
          console.log(res)
        }, (err) => {
          console.log(err)
        })
      },
      handleCheckChange(data, checked, indeterminate) {
      }
    },
    data() {
      return {
        data2: null,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        checkedData: null,
        loading: false,
        frontId: null,
        showData: null,
        oldCheckedData: null
      };
    },
    mounted () {
      this.$http.post('/api/getTreeData', {id: 123}).then((res) => {
        this.data2 = res.data
      }, (err) => {
        console.log(err)
      })

      this.$http.post('/api/getTreeCheckedData', {id: 123}).then((res) => {
        this.oldCheckedData = res.data.checkedData
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
