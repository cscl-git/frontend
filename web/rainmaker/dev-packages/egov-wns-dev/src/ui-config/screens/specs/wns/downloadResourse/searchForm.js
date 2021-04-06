import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getLabel,
  getPattern,
  getSelectField,
  getDateField,
  getTextField,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchApiCall } from "./functions";
import { convertDateToEpoch, convertDateToEpochIST } from "../../utils";

const resetFields = (state, dispatch) => {
  const textFields = ["indentNumber","indentPurpose", "inventoryType","indentStore","indentToDate","indentFromDate","indentRaisedBy"];
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.search-indent.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "search-indent",
          `components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}`,
          "props.value",
          ""
        )
      );
    }
  }
  dispatch(prepareFinalObject("searchScreen", {}));
};

export const searchForm = getCommonCard({
  // subHeader: getCommonTitle({
  //   labelName: "Search Criteria",
  //   labelKey: "STORE_SEARCH_RESULTS_HEADING",
  // }),
  // subParagraph: getCommonParagraph({
  //   labelName: "Provide at least one parameter to search for an application",
  //   labelKey: "STORE_HOME_SEARCH_RESULTS_DESC",
  // }),


  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      // resetButton: {
      //   componentPath: "Button",
      //   gridDefination: {
      //     xs: 12,
      //     sm: 4,
      //     // align: "center"
      //   },
      //   props: {
      //     variant: "outlined",
      //     style: {
      //       color: "#FE7A51",
      //       borderColor: "#FE7A51",
      //       //   borderRadius: "2px",
      //       width: "220px",
      //       height: "48px",
      //       margin: "8px",
      //       float: "center",
      //     },
      //   },
      //   children: {
      //     buttonLabel: getLabel({
      //       labelName: "Reset",
      //       labelKey: "STORE_COMMON_RESET_BUTTON",
      //     }),
      //   },
      //   onClickDefination: {
      //     action: "condition",
      //     callBack: resetFields,
      //   },
      // },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
         align: "left"
        },
        props: {
          variant: "contained",
          color: "primary",
          style: {
            //minWidth: "200px",
            height: "48px",
            marginRight: "45px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Download",
            labelKey: "Download",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall,
        },
      },
    }),
  }),
});