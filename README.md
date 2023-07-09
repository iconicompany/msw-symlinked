## Installation
npm install msw-symlinked

## Stubbing Responses with MSW and msw-symlinked

When working with [MSW (Mock Service Worker)](https://mswjs.io/), you can stub responses for your API requests using the `stubResponse` function. This function allows you to provide file-based stubs and optional response variants.

### Code Example

Create real response files, for example `exampleapi.200`, `exampleapi.500`

Then create a symlink `examplejson`, pointing to one of the response files.

```javascript
import { rest } from 'msw';
import { stubResponse } from 'msw-symlinked';

// Define your MSW request handler
const exampleRequestHandler = rest.get('/api/example', async (req, res, ctx) => stubResponse('/home/user/exampleapi'));

// Start mocking the API using MSW with the request handler
worker.start(exampleRequestHandler);
```

`msw-symlinked` will check the symlinked file, and will gather HTTP code and variant name.

If you need to add custom logic for the specific variant, create a file with variant name (`exampleapi.200.EXAMPLE_VARIANT`) and pass variants map to the `stubResponse`:

```javascript
import { rest } from 'msw';
import { stubResponse } from 'msw-symlinked';

// Define your MSW request handler
const exampleRequestHandler = rest.get('/api/example', async (req, res, ctx) => {
  // Stub the response using the stubResponse function
  const response = await stubResponse('/home/user/example', {
    EXAMPLE_VARIANT: [ctx.set('Header', 'Heder-value')]
  });
});

// Start mocking the API using MSW with the request handler
worker.start(exampleRequestHandler);
```

In this example when symlink will be pointing to the `exampleapi.200.EXAMPLE_VARIANT` stub, additional headers will be added to the response.