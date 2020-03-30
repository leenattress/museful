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

  let result;
  let commits;

  async function getResult() {
    let response = await fetch(`http://localhost:3000/musings`, {
      method: "GET"
    });
    return await response.json();
  }

  async function getCommits() {
    let response = await fetch(`http://localhost:3000/commits`, {
      method: "GET"
    });
    return await response.json();
  }

  function clean(invalid) {
    var container = document.createElement("div");
    return (container.innerHTML = invalid), container.innerHTML;
  }

  // Takes an ISO time and returns a string representing how
  // long ago the date represents.
  function prettyDate(time) {
    var date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
      diff = (new Date().getTime() - date.getTime()) / 1000,
      day_diff = Math.floor(diff / 86400);

    if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return;

    return (
      (day_diff == 0 &&
        ((diff < 60 && "just now") ||
          (diff < 120 && "1 minute ago") ||
          (diff < 3600 && Math.floor(diff / 60) + " minutes ago") ||
          (diff < 7200 && "1 hour ago") ||
          (diff < 86400 && Math.floor(diff / 3600) + " hours ago"))) ||
      (day_diff == 1 && "Yesterday") ||
      (day_diff < 7 && day_diff + " days ago") ||
      (day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago")
    );
  }

  result = getResult();
  // commits = getCommits();

  $: timeline = () => {
    
  }
</script>

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
          <li class="breadcrumb-item active" aria-current="page">timeline</li>
          <li class="ml-auto">
            <a class="btn btn-secondary btn-sm" href="/#/create">create</a>
          </li>
        </ol>
      </nav>
    </Col>
  </Row>
  <!-- <Row>
    <Col>
      {#if commits === undefined}
        <p />
      {:else}
        {#await commits}

          <p>Loading...</p>

        {:then value}

          {#if value.commits}
            <ul class="list-group">
              {#each value.commits as commit}
                <li class="list-group-item"><code>{commit.abbrevHash}</code>: {commit.subject}</li>
              {/each}
            </ul>
          {/if}

        {:catch error}
          {error.message}
        {/await}
      {/if}
    </Col>
  </Row> -->

  <Row>

    <Col class="col-md-12">

      <ul class="timeline">

        {#if result === undefined}
          <p />
        {:else}
          {#await result}

            <p>Loading...</p>

          {:then value}

            {#if value.files}
              {#each value.files as musing}
                <li class="pb-5">
                  <div
                    class="text-left text-secondary mb-4 p-3 bg-dark rounded">
                    <a
                      href="/#/edit/{musing.id}"
                      class="btn btn-secondary btn-sm float-right">
                      edit
                    </a>
                    <strong class="text-white">{musing.user}</strong>
                    on branch
                    <strong class="text-white">{musing.branch}</strong>
                    at commit
                    <strong class="text-white">{musing.commit}</strong>
                    <div class="lead">{prettyDate(musing.created)}</div>
                  </div>
                  <div class="md-html text-light">
                    {@html clean(marked(musing.content))}
                  </div>
                </li>
              {/each}
            {/if}

          {:catch error}
            {error.message}
          {/await}
        {/if}

      </ul>

    </Col>

  </Row>
</Container>
