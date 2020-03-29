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
    push('/');
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

    <Col>
      {#if !id}
        <div class="form-group pt-2">
          <label for="markdownTitle">Title</label>
          <input
            type="text"
            bind:value={title}
            class="form-control"
            id="markdownTitle"
            placeholder="Type a title here" />
        </div>
      {/if}
      <div class="form-group pt-4">
        <textarea bind:value={source} class="form-control source" />
      </div>
    </Col>

    <Col>
      <div class="output pt-4">
        <h1>{title}</h1>
        {@html markdown}
      </div>
    </Col>

    <Col xs="12">

      <Button class="float-right" color="primary" on:click={handleClick}>
        Save
      </Button>

    </Col>

  </Row>
</Container>
