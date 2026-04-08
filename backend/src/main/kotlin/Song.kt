import kotlinx.serialization.Serializable

@Serializable
data class Song(
    val rank: String,
    val title: String,
    val artist: String,
    val released: String,
    val rating: String
)

fun toSong(row: List<Any>) = Song(
    rank     = row.getOrElse(0) { "" }.toString(),
    title    = row.getOrElse(1) { "" }.toString(),
    artist   = row.getOrElse(2) { "" }.toString(),
    released = row.getOrElse(3) { "" }.toString(),
    rating   = row.getOrElse(4) { "" }.toString()
)
