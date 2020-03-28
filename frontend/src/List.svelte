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
  let result;

  async function getResult() {
    let response = await fetch(`http://localhost:3000/musings`, {
      method: "GET"
    });
    return await response.json();
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
</script>

<Container>
  <Row>
    <Col xs="12">
      <nav aria-label="breadcrumb" class="mt-2">
        <ol class="breadcrumb bg-dark ">
          <li class="breadcrumb-item ">
            <a href="/#/" class="text-light">museful</a>
          </li>
          <li class="breadcrumb-item text-light active" aria-current="page">
            Musings
          </li>
        </ol>
      </nav>
    </Col>

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
                  <div class="float-right text-primary text-right">
                    
                    <div>Branch: <span class="text-secondary">{musing.branch}</span></div>
                    <div>Commit: <span class="text-secondary">{musing.commit}</span></div>
                  </div>
                  <div class="md-html">
                  <div class="text-secondary">{musing.file}</div>
                    {@html marked(musing.content)}
                  </div>
                  <span class="text-primary">
                    {prettyDate(musing.created)} by {musing.user}
                  </span>
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
