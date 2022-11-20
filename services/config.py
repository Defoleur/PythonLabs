from datetime import timedelta


def configure(app):
    app.config.update(
        TESTING=True,
        SECRET_KEY=
        b"AB\xf2\xeaGN\x96\xb5h'\xd1$\x841\x7f\xbfw\xc2\xd1#\xc9o0\x12\x03{\xba\x1b\x16\\\x9e\x19",
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=1))
