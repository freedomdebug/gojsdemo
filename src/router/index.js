import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import Swim from "@/components/Swim";
import Table from "@/components/Table";
import Add from "@/components/Add";
import Panel from "@/components/Panel";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "HelloWorld",
      component: HelloWorld
    },
    {
      path: "/swim",
      name: "Swim",
      component: Swim
    },
    {
      path: "/table",
      name: "Table",
      component: Table
    },
    {
      path: "/Add",
      name: "Add",
      component: Add
    },
    {
      path: "/Panel",
      name: "Panel",
      component: Panel
    }
  ]
});
