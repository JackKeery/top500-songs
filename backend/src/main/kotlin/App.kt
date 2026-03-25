import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.google.api.services.sheets.v4.Sheets
import com.google.api.services.sheets.v4.SheetsScopes
import com.google.auth.http.HttpCredentialsAdapter
import com.google.auth.oauth2.GoogleCredentials
import org.http4k.core.*
import org.http4k.core.Method.GET
import org.http4k.format.KotlinxSerialization.auto
import kotlinx.serialization.Serializable
import org.http4k.core.Status.Companion.INTERNAL_SERVER_ERROR
import org.http4k.routing.ResourceLoader
import org.http4k.routing.bind
import org.http4k.routing.routes
import org.http4k.routing.static
import org.http4k.server.Undertow
import org.http4k.server.asServer

@Serializable
data class Song(
    val rank: String,
    val title: String,
    val artist: String,
    val released: String,
    val rating: String
)

fun interface SongsRepository {
    fun fetchRows(): List<List<Any>>
}

fun toSong(row: List<Any>) = Song(
    rank     = row.getOrElse(0) { "" }.toString(),
    title    = row.getOrElse(1) { "" }.toString(),
    artist   = row.getOrElse(2) { "" }.toString(),
    released = row.getOrElse(3) { "" }.toString(),
    rating   = row.getOrElse(4) { "" }.toString()
)

fun songsHandler(repository: SongsRepository): HttpHandler = {
    try {
        val songs = repository.fetchRows().drop(1).map(::toSong)
        Body.auto<List<Song>>().toLens()(songs, Response(Status.OK))
    } catch (e: Exception) {
        Response(INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body("""{"error":"Failed to fetch songs"}""")
    }
}

fun googleSheetsRepository(sheets: Sheets): SongsRepository = SongsRepository {
    val sheetId = System.getenv("GOOGLE_SHEET_ID")
        ?: error("GOOGLE_SHEET_ID env var not set")
    sheets.spreadsheets().values()
        .get(sheetId, "Top500!A1:E501")
        .execute()
        .getValues() ?: emptyList()
}

fun sheetsClient(): Sheets {
    val credentials = GoogleCredentials.getApplicationDefault()
        .createScoped(listOf(SheetsScopes.SPREADSHEETS_READONLY))

    return Sheets.Builder(
        GoogleNetHttpTransport.newTrustedTransport(),
        GsonFactory.getDefaultInstance(),
        HttpCredentialsAdapter(credentials)
    )
        .setApplicationName("top500-songs")
        .build()
}

fun main() {
    val app = routes(
        "/api/songs" bind GET to songsHandler(googleSheetsRepository(sheetsClient())),
        static(ResourceLoader.Classpath("public"))
    )

    app.asServer(Undertow(8080)).start().also {
        println("Server started on http://localhost:8080")
    }.block()
}
