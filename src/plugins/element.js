import Vue from "vue";
import {
  Button,
  Input,
  Row,
  Col,
  Notification,
  RadioGroup,
  RadioButton,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Table,
  TableColumn,
  Form,
  FormItem,
  Message,
} from "element-ui";

Vue.use(Button);
Vue.use(Input);
Vue.use(Row);
Vue.use(Col);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Form);
Vue.use(FormItem);

Vue.prototype.$notify = Notification; //这里不用use，直接挂载到Vue上就可以
Vue.prototype.$message = Message; //这里不用use，直接挂载到Vue上就可以
