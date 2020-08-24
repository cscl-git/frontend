import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";

import { getIndentNoteListDetailsView } from "./view-indent-note-details"
import { getIndentIssueDetailsView } from "./view-material-indent-issue-details"
// import { getOtherDetailsView } from "./view-other-details";
import { masterCommonFooter } from "./footer";
import { totalValue } from '../creatematerialindentnoteResource/totalValue';

export const IndentNoteReviewDetails = isReview => {
  const viewIndentnoteDetails = getIndentNoteListDetailsView(isReview);
  const viewIndentIssueDetails = getIndentIssueDetailsView(isReview);
  // const viewOtherDetails = getOtherDetailsView(isReview);
  const footer = isReview ? masterCommonFooter() : {};
  return getCommonCard({
    viewIndentnoteDetails,
    viewIndentIssueDetails,
    totalValue,
    footer
  });
};
