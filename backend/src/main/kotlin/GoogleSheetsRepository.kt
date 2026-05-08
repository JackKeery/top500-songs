import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.google.api.services.sheets.v4.Sheets
import com.google.api.services.sheets.v4.SheetsScopes
import com.google.auth.http.HttpCredentialsAdapter
import com.google.auth.oauth2.GoogleCredentials

private val EXCLUDED_SHEETS = setOf("SongPool")

fun googleSheetsTabsRepository(sheets: Sheets): TabsRepository = TabsRepository {
    val sheetId = System.getenv("GOOGLE_SHEET_ID")
        ?: error("GOOGLE_SHEET_ID env var not set")
    sheets.spreadsheets()
        .get(sheetId)
        .execute()
        .sheets
        .map { it.properties.title }
        .filter { it !in EXCLUDED_SHEETS }
}

fun googleSheetsRepository(sheets: Sheets): SongsRepository = SongsRepository { tab ->
    val sheetId = System.getenv("GOOGLE_SHEET_ID")
        ?: error("GOOGLE_SHEET_ID env var not set")
    sheets.spreadsheets().values()
        .get(sheetId, "$tab!A1:E501")
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
