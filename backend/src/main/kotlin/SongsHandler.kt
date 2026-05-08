import org.http4k.core.*
import org.http4k.core.Status.Companion.BAD_REQUEST
import org.http4k.core.Status.Companion.INTERNAL_SERVER_ERROR
import org.http4k.format.KotlinxSerialization.auto

private val SAFE_TAB_NAME = Regex("[A-Za-z0-9 ]+")

fun songsHandler(repository: SongsRepository): HttpHandler = { request ->
    val tab = request.query("tab") ?: "Top500"
    if (!tab.matches(SAFE_TAB_NAME)) {
        Response(BAD_REQUEST)
            .header("Content-Type", "application/json")
            .body("""{"error":"Invalid tab name"}""")
    } else {
        try {
            val songs = repository.fetchRows(tab).drop(1).map(::toSong)
            Body.auto<List<Song>>().toLens()(songs, Response(Status.OK))
        } catch (e: Exception) {
            Response(INTERNAL_SERVER_ERROR)
                .header("Content-Type", "application/json")
                .body("""{"error":"Failed to fetch songs"}""")
        }
    }
}
