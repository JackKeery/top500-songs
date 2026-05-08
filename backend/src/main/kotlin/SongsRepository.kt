fun interface SongsRepository {
    fun fetchRows(tab: String): List<List<Any>>
}
