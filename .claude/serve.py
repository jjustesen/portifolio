"""Static server for the mockups that disables browser caching, so edits show up on reload."""
import functools
import http.server
import sys

port = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
directory = sys.argv[2] if len(sys.argv) > 2 else "."


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


handler = functools.partial(NoCacheHandler, directory=directory)
http.server.ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
