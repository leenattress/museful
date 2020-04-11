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

  function normalizeDate(time) {
    switch (typeof time) {
      case "number":
        break;
      case "string":
        time = +new Date(time);
        break;
      case "object":
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    return time;
  }
  function prettyDate(time) {
    time = normalizeDate(time);
    var time_formats = [
      [60, "seconds", 1], // 60
      [120, "1 minute ago", "1 minute from now"], // 60*2
      [3600, "minutes", 60], // 60*60, 60
      [7200, "1 hour ago", "1 hour from now"], // 60*60*2
      [86400, "hours", 3600], // 60*60*24, 60*60
      [172800, "Yesterday", "Tomorrow"], // 60*60*24*2
      [604800, "days", 86400], // 60*60*24*7, 60*60*24
      [1209600, "Last week", "Next week"], // 60*60*24*7*4*2
      [2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
      [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
      [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
      [58060800000, "centuries", 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = "ago",
      list_choice = 1;

    if (seconds == 0) {
      return "Just now";
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = "from now";
      list_choice = 2;
    }
    var i = 0,
      format;
    while ((format = time_formats[i++]))
      if (seconds < format[0]) {
        if (typeof format[2] == "string") return format[list_choice];
        else
          return (
            Math.floor(seconds / format[2]) + " " + format[1] + " " + token
          );
      }
    return time;
  }

  result = getResult();
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
                    <div>{musing.id}</div>
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
