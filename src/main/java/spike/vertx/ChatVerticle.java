package spike.vertx;

import org.vertx.java.core.http.HttpServer;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.platform.Verticle;

public class ChatVerticle extends Verticle {
    @Override
    public void start() {
        HttpServer httpServer = vertx.createHttpServer();
        JsonObject config = new JsonObject().putString("prefix", "/messy-chat");

        JsonArray noPermitted = new JsonArray();
        noPermitted.add(new JsonObject());

        vertx.createSockJSServer(httpServer).bridge(config, noPermitted, noPermitted);
        httpServer.listen(8080);
    }
}
