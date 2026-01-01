export default interface BugLog {
    BugLogId: number,
    BugName: string,
    AddDate: string,
    CompletedDate: string,
    ResolutionNotes: string,
    IsModified: number,
    isNew: boolean
}