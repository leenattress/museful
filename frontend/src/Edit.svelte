<script>
  export let params = {};
	import { onMount } from 'svelte';
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

  let title = ``;
  let source = ``;
  $: markdown = marked(source);

  async function getMarkdown(id) {
    let response = await fetch(`/musings/${id}`);
    return await response.json();
  }

  const handleClick = () => {};

	onMount(async () => {
    if (params && params.id) {
      const markdownReturn = await getMarkdown(params.id);
      console.log('🎈', markdownReturn)
      source = markdownReturn.musing.content;
    }
	});  
</script>

<style>
  .source {
    border: none;
    width: 100%;
    height: 100%;
    min-height: 800px;
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
      <div class="form-group pt-2">
        <label for="markdownTitle">Title</label>
        <input
          type="text"
          bind:value={title}
          class="form-control"
          id="markdownTitle"
          placeholder="Type a title here" />
      </div>
      <div class="form-group pt-0">
      {params.id}
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
