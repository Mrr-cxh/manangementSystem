import Vue from "vue";
import {
  Button,
  Input,
  Notification,
  Menu,
  Submenu,
  MenuItem,
  Table,
  TableColumn,
  Form,
  FormItem,
  Message,
  Header,
  Container,
  Aside,
  Main,
} from "element-ui";

Vue.use(Button);
Vue.use(Input);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Header);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Main);

Vue.prototype.$notify = Notification; //这里不用use，直接挂载到Vue上就可以
Vue.prototype.$message = Message; //这里不用use，直接挂载到Vue上就可以
