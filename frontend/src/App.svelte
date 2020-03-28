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
  } from 'sveltestrap';

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

<Navbar color="dark" dark expand="md">
  <NavbarBrand href="/">
  <img src="museful-logo.png" width="32" height="32" class="d-inline-block align-top" alt="">
  <span class="ml-2">museful</span>
  </NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ml-auto" navbar>
      <NavItem>
        <NavLink href="/#/new">Create</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/#/read                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   ">Read</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="https://github.com/leenattress/museful">GitHub</NavLink>
      </NavItem>
    </Nav>
  </Collapse>
</Navbar>

<Router {routes} />
