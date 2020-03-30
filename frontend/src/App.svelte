<script>
  import List from "./List.svelte";
  import Edit from "./Edit.svelte";
  import Help from "./Help.svelte";
  import NotFound from "./NotFound.svelte";
  import Router from "svelte-spa-router";
  import "@forevolve/bootstrap-dark/dist/css/bootstrap-dark.min.css";

  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
  } from "sveltestrap";

  let isOpen = false;

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }

  const routes = {
    "/": List,
    "/create": Edit,
    "/help": Help,
    "/edit/:id": Edit,
    "*": NotFound
  };
</script>

<style>
html {
  position: relative;
  min-height: 100%;
}
body {
  margin-bottom: 60px; /* Margin bottom by footer height */
}
.footer {
  z-index: 9999 !important;
  position: fixed;
  bottom: 0;
  width: 100%;
  /* Set the fixed height of the footer here */
  height: 40px;
  line-height: 40px; /* Vertically center the text there */
  background-color: #2c3238;
}
.fade-in-top{-webkit-animation:fade-in-top .6s cubic-bezier(.39,.575,.565,1.000) both;animation:fade-in-top .6s cubic-bezier(.39,.575,.565,1.000) both}
@-webkit-keyframes fade-in-top{0%{-webkit-transform:translateY(-50px);transform:translateY(-50px);opacity:0}100%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}@keyframes fade-in-top{0%{-webkit-transform:translateY(-50px);transform:translateY(-50px);opacity:0}100%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}
</style>

<div class="fade-in-top">
  <Router {routes} />
</div>

<footer class="footer">
  <div class="container">
    <span class="text-muted float-left">
      Powered by
      <a href="https://svelte.dev/">SVELTE</a>
      and <a href="https://ko-fi.com/leenattress">COFFEE</a>
    </span>
    <span class="text-primary float-right">
      <a href="https://github.com/leenattress/museful">View on GitHub</a>
    </span>
  </div>
</footer>
