<script>
  import List from "./List.svelte";
  import Edit from "./Edit.svelte";
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
    "/new": Edit,
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
</style>

<Navbar color="dark" dark expand="md">
  <NavbarBrand href="/">
    <img
      src="museful-logo.png"
      width="32"
      height="32"
      class="d-inline-block align-top"
      alt="" />
    <span class="ml-2">museful</span>
  </NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ml-auto" navbar>
      <NavItem>
        <NavLink href="/#/new">Create</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/#/">Read</NavLink>
      </NavItem>
    </Nav>
  </Collapse>
</Navbar>

<Router {routes} />

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
