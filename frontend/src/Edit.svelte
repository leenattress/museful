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

  import { push } from "svelte-spa-router";

  // import hljs from 'highlight.js/lib/highlight';
  // import hljs from 'highlight.js';
  // import 'highlight.js/styles/github.css';

  function resize({ target }) {
    window.setTimeout(function() {
      target.style.height = "1px";
      target.style.height = +target.scrollHeight + "px";
    }, 1);
  }

  function resizeElement(element, watch = false) {
    const el = document.getElementById(element);
    el.style.overflow = "hidden";
    resize({ target: el });
    if (watch) {
      el.addEventListener("input", resize);
    }
  }

  let source = ``;
  let id;
  let preview = false;

  $: markdown = marked(source);

  function handleCheckboxClicked() {
    window.setTimeout(function() {
      resizeElement("markdown-source");
    }, 20);
  }

  async function getMarkdown(id) {
    let response = await fetch(`/musings/${id}`);
    return await response.json();
  }

  async function saveMusing(update = false, id = "") {
    let response = await fetch(`http://localhost:3000/musings`, {
      method: update ? "PUT" : "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: source,
        id
      })
    });
    const obj = await response.json();
    push("/");
  }

  const handleClickCreate = () => saveMusing(false);
  const handleClickUpdate = () => saveMusing(true, id);

  onMount(async () => {
    if (params && params.id) {
      const markdownReturn = await getMarkdown(params.id);
      source = markdownReturn.musing.content;
      id = markdownReturn.musing.id;
    }
    // auto resize
    resizeElement("markdown-source", true);
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
    border: none;
    width: 100%;
    height: 100%;
    min-height: 500px;
  }

  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(160, 160, 160);
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #28a745;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #28a745;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .slide-in-right {
    -webkit-animation: slide-in-right 0.5s
      cubic-bezier(0.95, 0.05, 0.795, 0.035) both;
    animation: slide-in-right 0.5s cubic-bezier(0.95, 0.05, 0.795, 0.035) both;
  }
  @-webkit-keyframes slide-in-right {
    0% {
      -webkit-transform: translateX(1000px);
      transform: translateX(1000px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slide-in-right {
    0% {
      -webkit-transform: translateX(1000px);
      transform: translateX(1000px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
      opacity: 1;
    }
  }

  .shake-horizontal {
    -webkit-animation: shake-horizontal 0.4s
      cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.5s both;
    animation: shake-horizontal 0.4s cubic-bezier(0.455, 0.03, 0.515, 0.955)
      0.5s both;
  }
  @-webkit-keyframes shake-horizontal {
    0%,
    100% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70% {
      -webkit-transform: translateX(-10px);
      transform: translateX(-10px);
    }
    20%,
    40%,
    60% {
      -webkit-transform: translateX(10px);
      transform: translateX(10px);
    }
    80% {
      -webkit-transform: translateX(8px);
      transform: translateX(8px);
    }
    90% {
      -webkit-transform: translateX(-8px);
      transform: translateX(-8px);
    }
  }
  @keyframes shake-horizontal {
    0%,
    100% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70% {
      -webkit-transform: translateX(-10px);
      transform: translateX(-10px);
    }
    20%,
    40%,
    60% {
      -webkit-transform: translateX(10px);
      transform: translateX(10px);
    }
    80% {
      -webkit-transform: translateX(8px);
      transform: translateX(8px);
    }
    90% {
      -webkit-transform: translateX(-8px);
      transform: translateX(-8px);
    }
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
          <li class="ml-auto">
            <a class="btn btn-secondary btn-sm" href="/#/">timeline</a>
          </li>
        </ol>

      </nav>

    </Col>
  </Row>

  <Row>

    <Col>
      <div class="pt-1 mt-0 mb-3">
        <textarea
          id="markdown-source"
          placeholder="Your thoughts go here, you can use markdown and html."
          bind:value={source}
          class="form-control source text-light bg-dark {preview ? 'shake-horizontal' : ''}" />
      </div>
    </Col>

    {#if preview}
      <Col>
        <div class="output p-4 pt-1 mt-0 slide-in-right text-dark bg-light">
          {@html markdown}
        </div>
      </Col>
    {/if}

    <Col xs="12 mb-3">

      <div class="float-left">
        <!-- Rounded switch -->
        <label class="switch">
          <input
            type="checkbox"
            bind:checked={preview}
            on:change={handleCheckboxClicked} />
          <span class="slider round" />
        </label>
        <p class="text-success">Preview</p>
      </div>

      <p class="p-0 m-0 text-muted text-right">
        <small>
          This will create a markdown file in
          <code>./musings/src/_____.md</code>
          to be later read or edited.
          <br />
          These thoughts are then read by others during code review.
          <br />
          Keep it clean.
        </small>
      </p>
    </Col>

    <Col xs="12">

      {#if !id}
        <Button
          class="btn-lg float-right"
          color="primary"
          on:click={handleClickCreate}>
          <span class="font-weight-bold">Save to timeline</span>
        </Button>
      {/if}
      {#if id}
        <Button
          class="float-right"
          color="primary"
          on:click={handleClickUpdate}>
          Update
        </Button>
      {/if}

    </Col>

  </Row>
</Container>
