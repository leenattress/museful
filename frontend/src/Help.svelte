<script>
  import {
    Button,
    Col,
    Container,
    Row,
    Breadcrumb,
    BreadcrumbItem,
    Media
  } from "sveltestrap";
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
          <li class="breadcrumb-item active" aria-current="page">help</li>
          <li class="ml-auto">
            <a class="btn btn-secondary btn-sm" href="/#/new">create</a>
          </li>
        </ol>
      </nav>
    </Col>
  </Row>

  <Row>
    <Col>
      <h1>museful</h1>
      <p>
        Have you ever wanted to say more about what you're working on that just
        a commit message?
      </p>
      <p>
        Sometimes when you code, you want to talk about the reasons why you did
        something the way you did it, or to show off some clever way you solved
        a problem.
      </p>
      <p>
        A lot of the time these things are only in your head and your knowledge,
        technique or idea is lost in the ether. I've put together this tool to
        help you get these ideas out of your head and into the project, so they
        are forever.
      </p>
      <p>My hope is that we learn from each other and pass if forward.</p>
      <p>
        We can learn from each other, and not make the same mistakes over and
        over.
      </p>
      <p>
        We can have more then the sterile commit messages that are present in
        your source control.
      </p>
      <p class="font-weight-bold">We can have gifs</p>
      <img class="img-fluid" alt="coding" src="https://i.imgur.com/JZrUNZr.gif" />
      <p class="font-italic">- Lee Nattress</p>
    </Col>
  </Row>

</Container>
