<script>
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

  let source = `
## What I'm working on
What part of the code are you working on now?

## I've solved a problem
What problem have you just solved?

## Here are some examples
Are there any code snippets you're particularly proud of?

## Lessons learned
What have you learned, what can you teach others?

## Further teachings
Where can I go to learn more about this?


`;
  $: markdown = marked(source);


  const handleClick = () => alert('I warned you!');


</script>

<style>
  .source {
    border: none;
    width: 100%;
    height: 100%;
    background: #343a40;
    color: #fff;
    min-height: 800px;
    padding: 1em 2em;
  }
  .source:focus {
    outline: none;
  }
  .output {
    width: 100%;
    padding: 1em 2em;
  }
</style>

<!-- <Container> -->

<Row>

  <Col>
    <textarea bind:value={source} class="source" />
  </Col>

  <Col>
    <div class="output">
      {@html markdown}
    </div>
  </Col>
  
    <Col xs="12">

		<Button class="float-right" color="primary" on:click={handleClick}>Save</Button>

	</Col>

</Row>
<!-- </Container> -->
