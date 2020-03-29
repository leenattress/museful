<script>
  export let params = {};
  import { onMount } from "svelte";
  import marked from "marked";
  import {
    Button,
    Col,
    Container,
    Row,
    Breadcrumb,
    BreadcrumbItem,
    Media
  } from "sveltestrap";
  import "@forevolve/bootstrap-dark/dist/css/bootstrap-dark.min.css";
  import { push } from "svelte-spa-router";

  let title = ``;
  let source = ``;
  let id;

  let preview = false;

  $: markdown = marked(source);

  async function getMarkdown(id) {
    let response = await fetch(`/musings/${id}`);
    return await response.json();
  }

  async function createMusing() {
    let response = await fetch(`http://localhost:3000/musings`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: source,
        title: title
      })
    });
    const obj = await response.json();
    console.log("🎈", obj);
    //push(`/edit/${obj.id}`);
    push("/");
    // return await response.json();
  }

  const handleClick = () => {
    createMusing();
  };

  onMount(async () => {
    if (params && params.id) {
      const markdownReturn = await getMarkdown(params.id);
      source = markdownReturn.musing.content;
      id = markdownReturn.musing.id;
    }
  });
</script>

<style>
  .source {
    border: none;
    width: 100%;
    height: 100%;
    min-height: 500px;
  }
  .source:focus {
    outline: none;
  }
  .output {
    width: 100%;
  }
</style>

<Container>

  <Row>
    <Col xs="12 mt-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb bg-dark">
          <li class="breadcrumb-item">
            <a href="/#/">
              <img
                src="museful-logo.png"
                width="28"
                height="28"
                class="d-inline-block align-top"
                alt="" />
            </a>
          </li>
          <li class="breadcrumb-item active" aria-current="page">create</li>
          <!-- <li class="ml-auto">
            <button class="btn btn-secondary btn-sm">

              <img
                src="question.svg"
                width="16"
                height="16"
                class="d-inline-block align-top text-light"
                alt="" />
              Help
            </button>
          </li> -->
        </ol>

      </nav>

    </Col>
  </Row>

  <Row>

    <Col>
      <!-- {#if !id}
        <div class="form-group pt-2">
          <input
            type="text"
            bind:value={title}
            class="form-control"
            id="markdownTitle"
            placeholder="What do you want to tell people about?" />
        </div>
      {/if} -->
      <div class="form-group pt-1 mt-0">
        <textarea
          placeholder="Your thoughts go here, you can use markdown."
          bind:value={source}
          class="form-control source" />
      </div>
    </Col>

    {#if preview}
      <Col>
        <div class="output pt-4">
          {@html markdown}
        </div>
      </Col>
    {/if}

    <Col xs="12 mb-3">
      <p class="p-0 m-0 text-muted text-right">
        <small>
          This will create a markdown file in
          <code>./musings/src/_____.md</code>
          to be later read or edited.<br>
          These thoughts are then part of your project source.
        </small>
      </p>
    </Col>    

    <Col xs="12">

      {#if !id}
        <Button
          class="btn-lg float-right"
          color="secondary"
          on:click={handleClick}>
          <span class="font-weight-bold">Save to timeline</span>
        </Button>
      {/if}
      {#if id}
        <Button class="float-right" color="secondary" on:click={handleClick}>
          Update
        </Button>
      {/if}

    </Col>

  </Row>
</Container>
