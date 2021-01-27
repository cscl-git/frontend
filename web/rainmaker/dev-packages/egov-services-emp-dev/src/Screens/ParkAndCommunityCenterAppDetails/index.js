import React, { Component } from "react";
import { Details } from "modules/common";
import { Button } from "components";
import { ComplaintTimeLine } from "modules/common";
import { Comments } from "modules/common";
import { Screen } from "modules/common";
import { resetFiles } from "egov-ui-kit/redux/form/actions";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import OSMCCBookingDetails from "../AllApplications/components/OSMCCBookingDetails"
import AppDetails from "./components/ApplicantDetails"; 
import UserBankDetails from "./components/UserBankDetails";
import RefundCard from "./components/RefundCard"; 
import BookingDetails from "./components/BookingDetails"
import DocumentPreview from "../AllApplications/components/DocumentPreview"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import PaymentDetails from "./components/PaymentDetails"
import PaymentDetailFirstModified from "./components/PaymentDetailFirstModified"
import AppStateModifiedPayDetail from "./components/AppStateModifiedPayDetail"
import ApproveCancellation from "../CancelledAppApproved";
import RejectCancellation from "../CancelledAppReject";
import Label from "egov-ui-kit/utils/translationNode";
import jp from "jsonpath";
import {
	downloadEsamparkApp,downloadEsamparkPL
} from "egov-ui-kit/redux/bookings/actions";
import {getFileUrlFromAPI} from '../../modules/commonFunction'
import { httpRequest } from "egov-ui-kit/utils/api";
import {
	getDateFromEpoch,
	mapCompIDToName,
	isImage,
	fetchImages,
	returnSLAStatus,
	getPropertyFromObj,
	findLatestAssignee,
	getTranslatedLabel
} from "egov-ui-kit/utils/commons";
import {
	fetchApplications,fetchPayment, fetchHistory, fetchDataAfterPayment, downloadReceiptForPCC, downloadAppForPCC,
	sendMessage, downloadPLForPCC,
	sendMessageMedia
} from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import DialogContainer from '../../modules/DialogContainer';
import Footer from "../../modules/footer"
import ActionButtonDropdown from '../../modules/ActionButtonDropdown'
import { convertEpochToDate, getDurationDate } from '../../modules/commonFunction'
import "./index.css";



class ApplicationDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openMap: false,
			docFileData: [],
			bookingType: '',
			open: false,
			setOpen: false,
			togglepopup: false,
			actionOnApplication: '',
			actionTittle: '',
			actionOpen: false,
			refundCard: false,
			totalRefundAmount: '',
			payload: '',
			AppName : '',
			fullAmountDetail: '',
			CheckStatus : '',
			modifiedFirstAmount: '',
			modifiedSecondAmount: '',
			newPaymentDetails: 'NotFound',
			checkGreaterDate: '',
			checkNumDays: ''
		};
	};

	handleActionButtonClose = () => {
		this.setState({
			actionOpen: false
		})
	};

	handleActionButtonOpen = () => {
		this.setState({
			actionOpen: true
		})
	};


	componentDidMount = async () => {
		let {
			fetchApplications,
			fetchHistory,
			fetchPayment,
			fetchDataAfterPayment, downloadReceiptForPCC,
			match,
			resetFiles,
			transformedComplaint,
			prepareFormData,
			userInfo,
			documentMap,
			prepareFinalObject,selectedComplaint,
			
		} = this.props;
		console.log("propsforRefund--",this.props)

	   let AppNo = selectedComplaint.bkApplicationNumber
	   console.log("AppNo--",AppNo)

	   let funtenantId = selectedComplaint.tenantId
	   console.log("funtenantId--",funtenantId)

	   let FromDate = selectedComplaint.bkFromDate
	   console.log("FromDate--",FromDate)

	   let complaintCountRequest = 
			{
				"applicationNumber": match.params.applicationId, 'uuid': userInfo.uuid,
				"applicationStatus": "",
				"mobileNumber": "", "bookingType": "","tenantId" : userInfo.tenantId
			}
		  
		let dataforSectorAndCategory = await httpRequest( 	
			"bookings/api/employee/_search",
		    "_search",[],
		    complaintCountRequest
		  );
          console.log("dataforSectorAndCategory--",dataforSectorAndCategory)
		  let bkLocation = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkLocation : 'NA'
		  let bkFromDate = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkFromDate : 'NA'
		  let bkToDate = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkToDate : 'NA'
		  let AppStatus = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkApplicationStatus : 'NA'
		  let bkBookingType = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkBookingType : 'NA'
		  let Sector = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkSector : 'NA'
          let bkBookingVenue = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkBookingVenue : 'NA'

    if(dataforSectorAndCategory.bookingsModelList[0].timeslots.length > 0){
		let timeSlot = dataforSectorAndCategory.bookingsModelList[0].timeslots[0].slot
		console.log("timeSlot--",timeSlot)

		prepareFinalObject("oldAvailabilityCheckData.TimeSlot",timeSlot);

		let res = timeSlot.split("-");
		console.log("res--",res)

		let fromTime = res[0] 
		console.log("fromTime--",fromTime);

		prepareFinalObject("oldAvailabilityCheckData.TimeSlotfromTime",fromTime);


		let ToTime = res[1]
		console.log("ToTime--",ToTime);

		prepareFinalObject("oldAvailabilityCheckData.TimeSlotToTime",ToTime);


        let strMid = ","

		let ConcatFromDateTime = bkFromDate.concat(strMid).concat(fromTime);
		console.log("ConcatFromDateTime--",ConcatFromDateTime)

		prepareFinalObject("oldAvailabilityCheckData.ConcatFromDateTime",ConcatFromDateTime);

		let ConcatToDateTime = bkToDate.concat(strMid).concat(ToTime);
		console.log("ConcatToDateTime--",ConcatToDateTime)

		prepareFinalObject("oldAvailabilityCheckData.ConcatToDateTime",ConcatToDateTime);



		//let bkDisplayFromDateTime = 

		let timeSlotId = dataforSectorAndCategory.bookingsModelList[0].timeslots[0].id
		console.log("timeSlotId--",timeSlotId)
		
		prepareFinalObject("oldAvailabilityCheckData.timeSlotId",timeSlotId);



	}

    prepareFinalObject("oldAvailabilityCheckData.bkBookingType",bkBookingType);

    prepareFinalObject("oldAvailabilityCheckData.Sector",Sector);

	prepareFinalObject("oldAvailabilityCheckData.bkBookingVenue",bkLocation);

	prepareFinalObject("oldAvailabilityCheckData.FromDate",bkFromDate);

	prepareFinalObject("oldAvailabilityCheckData.bkFromDate",bkFromDate);

	prepareFinalObject("oldAvailabilityCheckData.bkToDate",bkToDate);

	prepareFinalObject("oldAvailabilityCheckData.bkBookingVenueID",bkBookingVenue);

	prepareFinalObject("PreviousBookingData.ToDate",bkToDate);
	
	prepareFinalObject("PreviousBookingData.FromDate",bkFromDate);

	prepareFinalObject("PreviousBookingData.bkBookingVenue",bkLocation);

	prepareFinalObject("PreviousBookingData.ApplicationStatus",AppStatus);

	let reqParams = [
        { key: "consumerCode", value: match.params.applicationId },
        { key: "tenantId", value: userInfo.tenantId }
		];
		

    let BillingServiceData = await httpRequest( 	
	"billing-service/bill/v2/_search",
	"_search",
	reqParams
   );

   console.log("BillingService--",BillingServiceData)




	this.setState({
		AppName : dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkApplicantName : 'NA',
		fullAmountDetail : BillingServiceData.Bill[2],
		CheckStatus : AppStatus,
		modifiedFirstAmount : BillingServiceData.Bill[0]
	})

		prepareFormData("complaints", transformedComplaint);
		const { complaint } = transformedComplaint;
		fetchApplications(
			{
				"applicationNumber": match.params.applicationId, 'uuid': userInfo.uuid,
				"applicationStatus": "",
				"mobileNumber": "", "bookingType": "",
				"tenantId": userInfo.tenantId
			}
		);
		fetchHistory([
			{ key: "businessIds", value: match.params.applicationId }, { key: "history", value: true }, { key: "tenantId", value: userInfo.tenantId }])

		fetchPayment(
			[{ key: "consumerCode", value: match.params.applicationId }, { key: "businessService", value: "PACC" }, { key: "tenantId", value: userInfo.tenantId }
			])
		fetchDataAfterPayment(
			[{ key: "consumerCodes", value: match.params.applicationId }, { key: "tenantId", value: userInfo.tenantId }
			])
		// if(selectedComplaint.bkApplicationStatus === "PENDING_FOR_APPROVAL_CLEARK_DEO" || selectedComplaint.bkApplicationStatus === "PENDING_FOR_APPROVAL_SENIOR_ASSISTANT" || selectedComplaint.bkApplicationStatus === "PENDING_FOR_APPROVAL_AUDIT_DEPARTMENT" ||
		// selectedComplaint.bkApplicationStatus === "PENDING_FOR_APPROVAL_CAO" || 	selectedComplaint.bkApplicationStatus === "PENDING_FOR_APPROVAL_CAO"
		// )

		let totalRes = await this.calculateCancelledBookingRefundAmount(AppNo, funtenantId, FromDate);
		console.log("totalRes--inrefundPage",totalRes)
	  
       this.setState({
	totalRefundAmount : totalRes
        })

		if(selectedComplaint.bkApplicationStatus === "PENDING_FOR_DISBURSEMENT"){
			this.setState({
				refundCard: true
			})	
		}



		let { details } = this.state;
	}


	calculateCancelledBookingRefundAmount = async (applicationNumber, tenantId, bookingDate) => {
		const {payloadone, paymentDetailsForReceipt, payloadTwo, ConRefAmt,refConAmount} = this.props;
		console.log("propsforcalculateCancelledBookingRefundAmount--",this.props)

		//refConAmount
		if(refConAmount != "NotFound"){
			this.setState({
				payload : refConAmount
			})
		}

		// let payload = paymentDetailsForReceipt;
		console.log("payload--calculateCancelledBookingRefundAmount",this.state.payload)
		
		var CheckDate = new Date(bookingDate);
		console.log("CheckDate--",CheckDate) 
		var todayDate = new Date();
		console.log("todayDate--",todayDate)
		
		
			if (applicationNumber && tenantId) {
			  
				console.log("Payment Details",this.state.payload ? this.state.payload : "NOTFOUND");
				if (this.state.payload) {
		
				  if(todayDate > CheckDate){
					// alert("refundCondition")
					let billAccountDetails = this.state.payload.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails;
					let bookingAmount = 0;
					for (let i = 0; i < billAccountDetails.length; i++) {
						if (billAccountDetails[i].taxHeadCode == "REFUNDABLE_SECURITY") {
							bookingAmount += billAccountDetails[i].amount;
						}
					}
				  
					return bookingAmount;
				  
				  }
				  if(todayDate < CheckDate) {
					// alert("cancelCondition")
					let billAccountDetails = this.state.payload.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails;
					let bookingAmount = 0;
					for (let i = 0; i < billAccountDetails.length; i++) {
						if (billAccountDetails[i].taxHeadCode == "REFUNDABLE_SECURITY") {
							bookingAmount += billAccountDetails[i].amount;
						}
						if (billAccountDetails[i].taxHeadCode == "PACC") {
							bookingAmount += billAccountDetails[i].amount;
						}
					}
		
		
		
					let mdmsBody = {
						MdmsCriteria: {
							tenantId: tenantId,
							moduleDetails: [
		
								{
									moduleName: "Booking",
									masterDetails: [
										{
											name: "bookingCancellationRefundCalc",
										}
									],
								},
		
							],
						},
					};
		
					let refundPercentage = '';
		
					let payloadRes = null;
					payloadRes = await httpRequest(
						"egov-mdms-service/v1/_search",
						"_search",[],
						mdmsBody
					);
					console.log(payloadRes, "RefundPercentage");
					refundPercentage = payloadRes.MdmsRes.Booking.bookingCancellationRefundCalc[0];
		console.log("refundPercentage--2--",refundPercentage)
		
				  var date1 = new Date(bookingDate);
				  console.log("date1--",date1) 
					var date2 = new Date();
		console.log("date2--",date2)
					var Difference_In_Time = date1.getTime() - date2.getTime();
		console.log("Difference_In_Time--",Difference_In_Time)
					// To calculate the no. of days between two dates
					var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
		console.log("Difference_In_Days--",Difference_In_Days)
					let refundAmount = 0
					if (Difference_In_Days > 29) {
						let refundPercent = refundPercentage.MORETHAN30DAYS.refundpercentage;
						console.log("refundPercent--1",refundPercent)
		
						refundAmount = (parseFloat(bookingAmount) * refundPercent) / 100
					} else if (Difference_In_Days > 15 && Difference_In_Days < 30) {
		
						let refundPercent = refundPercentage.LETTHAN30MORETHAN15DAYS.refundpercentage;
						refundAmount = (parseFloat(bookingAmount) * refundPercent) / 100
						console.log("refundPercent--2",refundPercent)
					}
		
		
					return refundAmount;
				  }
		
		
				}
			}
		
		
		}

	componentWillReceiveProps = async (nextProps) => {
		// alert("checkwillreceiveprops")
		const { transformedComplaint, prepareFormData } = this.props;
		if (!isEqual(transformedComplaint, nextProps.transformedComplaint)) {
			prepareFormData("complaints", nextProps.transformedComplaint);
		}

		if(nextProps.paymentDetails != undefined){
			//create new State To Send PaymentDetails for Refund
			this.setState({
				newPaymentDetails : nextProps.paymentDetails
			})
		
		}

	}
/*Cancel Emp Booking function*/
CancelEmpBooking = async () =>{
alert("ComeInCancelEmpBooking")
let {selectedComplaint} = this.props
console.log("propsInCancelEmpBooking--",selectedComplaint)

	let Booking= {
		"bkRemarks": null,
		"timeslots": [],
		"reInitiateStatus": false,
		"bkApplicationNumber": selectedComplaint.bkApplicationNumber,
		"bkHouseNo": selectedComplaint.bkHouseNo,
		"bkAddress": null,
		"bkSector": selectedComplaint.bkSector,
		"bkVillCity": null,
		"bkAreaRequired": null,
		"bkDuration": null,
		"bkCategory": null,
		"bkEmail": selectedComplaint.bkEmail,
		"bkContactNo": null,
		"bkDocumentUploadedUrl": null,
		"bkDateCreated": selectedComplaint.bkDateCreated,
		"bkCreatedBy": null,
		"bkWfStatus": null,
		"bkAmount": null,
		"bkPaymentStatus": selectedComplaint.bkPaymentStatus,
		"bkBookingType": selectedComplaint.bkBookingType,
		"bkFromDate": selectedComplaint.bkFromDate,
		"bkToDate": selectedComplaint.bkToDate,
		"bkApplicantName": selectedComplaint.bkApplicantName,
		"bkBookingPurpose": selectedComplaint.bkBookingPurpose,
		"bkVillage": null,
		"bkDimension": selectedComplaint.bkDimension,
		"bkLocation": selectedComplaint.bkLocation,
		"bkStartingDate": null,
		"bkEndingDate": null,
		"bkType": null,
		"bkResidenceProof": null,
		"bkCleansingCharges": selectedComplaint.bkCleansingCharges,
		"bkRent": selectedComplaint.bkRent,
		"bkSurchargeRent": selectedComplaint.bkSurchargeRent,
		"bkFacilitationCharges": null,
		"bkUtgst": selectedComplaint.bkUtgst,
		"bkCgst": selectedComplaint.bkCgst,
		"bkMobileNumber": selectedComplaint.bkMobileNumber,
		"bkCustomerGstNo": null,
		"bkCurrentCharges": null,
		"bkLocationChangeAmount": null,
		"bkVenue": null,
		"bkDate": null,
		"bkFatherName": null,
		"bkBookingVenue": selectedComplaint.bkBookingVenue,
		"bkBookingDuration": null,
		"bkIdProof": null,
		"bkApplicantContact": null,
		"bkOpenSpaceLocation": null,
		"bkLandmark": null,
		"bkRequirementArea": null,
		"bkLocationPictures": null,
		"bkParkOrCommunityCenter": null,
		"bkRefundAmount": null,
		"bkPropertyOwnerName": null,
		"bkCompleteAddress": null,
		"bkResidentialOrCommercial": null,
		"bkMaterialStorageArea": null,
		"bkPlotSketch": null,
		"bkApplicationStatus": selectedComplaint.bkApplicationStatus,
		"bkTime": null,
		"bkStatusUpdateRequest": null,
		"bkStatus": null,
		"bkDriverName": null,
		"bkVehicleNumber": null,
		"bkEstimatedDeliveryTime": null,
		"bkActualDeliveryTime": null,
		"bkNormalWaterFailureRequest": null,
		"bkUpdateStatusOption": null,
		"bkAddSpecialRequestDetails": null,
		"bkBookingTime": null,
		"bkApprovedBy": null,
		"bkModuleType": null,
		"uuid": null,
		"tenantId": selectedComplaint.tenantId,
		"bkAction": "OFFLINE_CANCEL",
		"bkConstructionType": null,
		"businessService": selectedComplaint.businessService,
		"bkApproverName": null,
		"discount": null,
		"assignee": null,
		"wfDocuments": [],
		"financialYear": selectedComplaint.financialYear,
		"financeBusinessService": null
	  }
console.log("CancelEmpBooking-Booking",Booking)
	  let createAppData = { 
		"applicationType": "PACC",
		"applicationStatus": "",
		"applicationId": selectedComplaint.bkApplicationNumber ? selectedComplaint.bkApplicationNumber : null,
		"tenantId": selectedComplaint.tenantId,
		"Booking": Booking   
	}
console.log("createAppData--createAppData",createAppData)
	let payloadfund = await httpRequest(
		"bookings/park/community/_update",
		"_search",[],
		createAppData
		);
console.log("payloadfund--cancel--",payloadfund)
this.props.history.push(`/egov-services/application-cancelled-success`);
}
  //actionButtonOnClick = (e, complaintNo, label)
	actionButtonOnClick = async (e, complaintNo, label) => {

		let AmountCondition = false;
		const { prepareFinalObject } = this.props;
		let {
			match,
			userInfo,
			selectedComplaint
		} = this.props;
		if (label == 'APPROVED') {
			this.setState({
				actionTittle: "Approve Application"
			})

			if(selectedComplaint.bkApplicationStatus == "PENDING_FOR_APPROVAL_OSD"){
				
				AmountCondition = true;

				prepareFinalObject(
					"ConditionForAmount",
					AmountCondition
				);
console.log("AmountCondition--",AmountCondition)
			}

			if(selectedComplaint.bkApplicationStatus == "PENDING_FOR_DISBURSEMENT"){
				let RequestData = [
					{ key: "consumerCode", value: match.params.applicationId },
					{ key: "tenantId", value: userInfo.tenantId }
				  ];
				let payloadfund = await httpRequest(
					"pg-service/transaction/v1/_search",
					"_search",
					RequestData
				  );
				
	console.log("RequestData--",RequestData)
	console.log("payloadfund--",payloadfund)
	console.log("payloadfund.Transaction--",payloadfund.Transaction)
			}
			

		} else {
			this.setState({
				actionTittle: "Reject Application"
			})
		}
		this.setState({
			togglepopup: !this.state.togglepopup,
			actionOnApplication: label
		})
	};

	btnTwoOnClick = (complaintNo, label) => {

		let { history } = this.props;
		switch (label) {
			case "ES_COMMON_ASSIGN":
				history.push(`/assign-complaint/${complaintNo}`);
				break;
			case "ES_COMMON_REASSIGN":
				history.push(`/reassign-complaint/${complaintNo}`);
				break;
			case "BK_MYBK_RESOLVE_MARK_RESOLVED":
				history.push(`/booking-resolved/${complaintNo}`);
				break;
		}
	};

	handleClickOpen = () => {
		this.setState({
			open: true
		})

	};
	handleClose = () => {
		this.setState({
			openPopup: false
		})
	};

	NumInWords = (number) => {
		const first = [
			"",
			"One ",
			"Two ",
			"Three ",
			"Four ",
			"Five ",
			"Six ",
			"Seven ",
			"Eight ",
			"Nine ",
			"Ten ",
			"Eleven ",
			"Twelve ",
			"Thirteen ",
			"Fourteen ",
			"Fifteen ",
			"Sixteen ",
			"Seventeen ",
			"Eighteen ",
			"Nineteen ",
		];
		const tens = [
			"",
			"",
			"Twenty",
			"Thirty",
			"Forty",
			"Fifty",
			"Sixty",
			"Seventy",
			"Eighty",
			"Ninety",
		];
		const mad = ["", "Thousand", "Million", "Billion", "Trillion"];
		let word = "";

		for (let i = 0; i < mad.length; i++) {
			let tempNumber = number % (100 * Math.pow(1000, i));
			if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
				if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
					word =
						first[Math.floor(tempNumber / Math.pow(1000, i))] +
						mad[i] +
						" " +
						word;
				} else {
					word =
						tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
						first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
						mad[i] +
						" " +
						word;
				}
			}

			tempNumber = number % Math.pow(1000, i + 1);
			if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
				word =
					first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] +
					"Hunderd " +
					word;
		}
		return word + "Rupees Only";
	};

	downloadPaymentReceiptFunction = async (e) => {
		const { transformedComplaint, paymentDetailsForReceipt,paymentDetails,offlineTransactionDate, offlinePayementMode,offlineTransactionNum,
			six,one,recNumber,	downloadReceiptForPCC, userInfo,selectedComplaint } = this.props;
		const { complaint } = transformedComplaint;


		let BookingInfo = [{
			"applicantDetail": {
				"name":  selectedComplaint.bkApplicantName,
				"mobileNumber": selectedComplaint.bkMobileNumber,
				"houseNo": selectedComplaint.bkHouseNo,
				"permanentAddress": "",
				"permanentCity": "Chandigarh",
				"sector": selectedComplaint.bkSector
			},
			"booking": {
				"bkApplicationNumber": selectedComplaint.bkApplicationNumber
			},
			"paymentInfo": {
				"paymentDate": convertEpochToDate(offlineTransactionDate, "dayend"),
				"transactionId": offlineTransactionNum,
				"bookingPeriod": getDurationDate(
					selectedComplaint.bkFromDate,
					selectedComplaint.bkToDate
				),
				"bookingItem": `Online Payment Against Booking of ${selectedComplaint.bkLocation}`,
				"amountInWords":  this.NumInWords(paymentDetails && paymentDetails.totalAmount),
				paymentItemExtraColumnLabel: "Booking Period",
				"paymentMode": offlinePayementMode,
				"receiptNo": recNumber,
				"baseCharge": one,
				"cleaningCharges": selectedComplaint.bkCleansingCharges,
				"surcharges": selectedComplaint.bkSurchargeRent,
				"facilitationCharge": six,
				"utgst": selectedComplaint.bkCgst,
				"cgst": selectedComplaint.bkCgst,
				"gst": selectedComplaint.bkCgst,
				"totalAmount": paymentDetails && paymentDetails.totalAmount
			},
			"payerInfo": {
				"payerName":  selectedComplaint.bkApplicantName,
				"payerMobile": selectedComplaint.bkMobileNumber,
			},
			"generatedBy": {
				"generatedBy": userInfo.name
			},
			"tenantInfo": {
				"municipalityName": "Municipal Corporation Chandigarh",
				"address": "New Deluxe Building, Sector 17, Chandigarh",
				"contactNumber": "+91-172-2541002, 0172-2541003"
			}
		}
		]
		downloadReceiptForPCC({ BookingInfo: BookingInfo })
	}

	downloadApplicationFunction = async (e) => {
		const { downloadEsamparkApp, userInfo,createPACCApplicationData,selectedComplaint,documentMap,six} = this.props;
		let fdocname = Object.entries(documentMap)[0][1]
	   let BookingInfo = [
		  {
			  "applicantDetail": {
				  "name": selectedComplaint.bkApplicantName,
				  "mobileNumber":selectedComplaint.bkMobileNumber,
				  "email": selectedComplaint.bkEmail,
				  "permanentAddress": "",
				  "permanentCity": "Chandigarh",
				  "sector": selectedComplaint.bkSector,
				  "fatherName": " "
			  },
			  "bookingDetail": {
				  "applicationNumber": selectedComplaint.bkApplicationNumber,
				  "applicationDate": "",
				  "bookingPeriod": getDurationDate(
					selectedComplaint.bkFromDate,
					selectedComplaint.bkToDate
				  ),
				  "venueName": selectedComplaint.bkLocation,
				  "sector": selectedComplaint.bkSector,
				  "bookingPurpose": selectedComplaint.bkBookingPurpose,
				  "parkDim": selectedComplaint.bkDimension
			  },
			  "feeDetail": {
				  "baseCharge": selectedComplaint.bkRent,
				  "cleaningCharge": selectedComplaint.bkCleansingCharges,
				  "surcharges": selectedComplaint.bkSurchargeRent,
				  "facilitationCharge": six ? six: "100",
				  "utgst": selectedComplaint.bkUtgst,
				  "cgst": selectedComplaint.bkCgst,
				  "gst": selectedComplaint.bkCgst,
				  "totalAmount": selectedComplaint.bkRent
			  },
			  "generatedBy":{
				"generatedBy": userInfo.name,
				"generatedDateTime": userInfo.createdDate
			},
			"documentDetail":{
				"documentName": fdocname
			}
		  }
	  ]
	
	  downloadEsamparkApp({ BookingInfo: BookingInfo })
	  };

	downloadApplicationButton = async (e) => {
		await this.downloadApplicationFunction();
		const { DownloadApplicationDetails,userInfo,Downloadesamparkdetails } = this.props;
		var documentsPreview = [];
		let documentsPreviewData;
		if (Downloadesamparkdetails && Downloadesamparkdetails.filestoreIds.length > 0) {	
			documentsPreviewData = Downloadesamparkdetails.filestoreIds[0];
				documentsPreview.push({
					title: "DOC_DOC_PICTURE",
					fileStoreId: documentsPreviewData,
					linkText: "View",
				});
				let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
				let fileUrls =
					fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,userInfo.tenantId) : {};
				
					
				documentsPreview = documentsPreview.map(function (doc, index) {
					doc["link"] =
						(fileUrls &&
							fileUrls[doc.fileStoreId] &&
							fileUrls[doc.fileStoreId].split(",")[0]) ||
						"";
					
					doc["name"] =
						(fileUrls[doc.fileStoreId] &&
							decodeURIComponent(
								fileUrls[doc.fileStoreId]
									.split(",")[0]
									.split("?")[0]
									.split("/")
									.pop()
									.slice(13)
							)) ||
						`Document - ${index + 1}`;
					return doc;
				});
			
				setTimeout(() => {
					
					window.open(documentsPreview[0].link);
				}, 100);
				prepareFinalObject('documentsPreview', documentsPreview)
			}

	}

	downloadPermissionLetterButton = async (e) => {
		await this.downloadPermissionLetterFunction();
		let documentsPreviewData;
		const { DownloadPermissionLetterDetails,userInfo,Downloadesamparkdetailspl
		} = this.props;
		var documentsPreview = [];
		if (Downloadesamparkdetailspl
			&& Downloadesamparkdetailspl
			.filestoreIds.length > 0) {
			 documentsPreviewData=Downloadesamparkdetailspl
			 .filestoreIds[0];
			documentsPreview.push({
				title: "DOC_DOC_PICTURE",
				fileStoreId: documentsPreviewData,
				linkText: "View",
			});
			let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
			let fileUrls =
				fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,userInfo.tenantId) : {};
		
	
			documentsPreview = documentsPreview.map(function (doc, index) {
				doc["link"] =
					(fileUrls &&
						fileUrls[doc.fileStoreId] &&
						fileUrls[doc.fileStoreId].split(",")[0]) ||
					"";
				
				doc["name"] =
					(fileUrls[doc.fileStoreId] &&
						decodeURIComponent(
							fileUrls[doc.fileStoreId]
								.split(",")[0]
								.split("?")[0]
								.split("/")
								.pop()
								.slice(13)
						)) ||
					`Document - ${index + 1}`;
				return doc;
			});
			
			setTimeout(() => {
				window.open(documentsPreview[0].link);
			}, 100);
			prepareFinalObject('documentsPreview', documentsPreview)
		}
	
	}

	downloadPermissionLetterFunction = async (e) => {
		const { transformedComplaint,paymentDetails,downloadPLForPCC ,userInfo,createPACCApplicationData,downloadEsamparkPL,Downloadesamparkdetailspl,selectedComplaint	} = this.props;
		let applicationDetails = createPACCApplicationData ? createPACCApplicationData.data : '';
		const {complaint} = transformedComplaint;
		let receiptData = [
			{
				"applicantDetail": {
					"name": selectedComplaint.bkApplicantName,
					"mobileNumber": selectedComplaint.bkMobileNumber,
					"houseNo":selectedComplaint.bkHouseNo,
					"permanentAddress": " ",
					"permanentCity": "Chandigarh",
					"sector": selectedComplaint.bkSector,
					"fatherName": ""
				},
				"bookingDetail": {
					"applicationNumber": selectedComplaint.bkApplicationNumber,
					"applicationDate": selectedComplaint.bkDateCreated,
					"bookingType": selectedComplaint.bkBookingType,
					"villageOrCity": null,
					"residentialOrCommercial": null,
					"areaRequired": null,
					"category": null,
					"typeOfConstruction": null,
					"permissionPeriod": getDurationDate(
						selectedComplaint.bkFromDate,
						selectedComplaint.bkToDate
					),
					"bookingPeriod": getDurationDate(
						selectedComplaint.bkFromDate,
						selectedComplaint.bkToDate
					),
					"venueName": selectedComplaint.bkLocation,
					"sector": selectedComplaint.bkSector,
					"groundName": selectedComplaint.bkSector,
					"bookingPurpose": selectedComplaint.bkBookingPurpose,
					"duration": "FULLDAY Months",
					"categoryImage": "",
					"parkDim": selectedComplaint.bkDimension
				},
				"generatedBy":{
					"generatedBy": userInfo.name,
				},
				"approvedBy": {
					"approvedBy": "Renil Commissioner",
					"role": "Additional Commissioner"
				},
				"tenantInfo": {
					"municipalityName": "Municipal Corporation Chandigarh",
					"address": "New Deluxe Building, Sector 17, Chandigarh",
					"contactNumber": "+91-172-2541002, 0172-2541003",
					"logoUrl": "https://chstage.blob.core.windows.net/fileshare/logo.png",
					"webSite": "http://mcchandigarh.gov.in"
				}
			}]
	
			downloadEsamparkPL({BookingInfo:receiptData})
	}

	downloadPaymentReceiptButton = async (e) => {
		this.downloadPaymentReceiptFunction();
		let documentsPreviewData;
		const { DownloadReceiptDetailsforPCC,userInfo } = this.props;
		var documentsPreview = [];
		if (DownloadReceiptDetailsforPCC && DownloadReceiptDetailsforPCC.filestoreIds.length > 0) {
			documentsPreviewData = DownloadReceiptDetailsforPCC.filestoreIds[0];
			documentsPreview.push({
				title: "DOC_DOC_PICTURE",
				fileStoreId: documentsPreviewData,
				linkText: "View",
			});
			let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
			let fileUrls =
			fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,userInfo.tenantId) : {};


			documentsPreview = documentsPreview.map(function (doc, index) {
				doc["link"] =
					(fileUrls &&
						fileUrls[doc.fileStoreId] &&
						fileUrls[doc.fileStoreId].split(",")[0]) ||
					"";

				doc["name"] =
					(fileUrls[doc.fileStoreId] &&
						decodeURIComponent(
							fileUrls[doc.fileStoreId]
								.split(",")[0]
								.split("?")[0]
								.split("/")
								.pop()
								.slice(13)
						)) ||
					`Document - ${index + 1}`;
				return doc;
			});

			setTimeout(() => {
				window.open(documentsPreview[0].link);
			}, 100);
			prepareFinalObject('documentsPreview', documentsPreview)
		}
	}

	callApiForDocumentData = async (e) => {
		const { documentMap,userInfo } = this.props;
		var documentsPreview = [];
		if (documentMap && Object.keys(documentMap).length > 0) {
			let keys = Object.keys(documentMap);
			let values = Object.values(documentMap);
			let id = keys[0],
				fileName = values[0];

			documentsPreview.push({
				title: "DOC_DOC_PICTURE",
				fileStoreId: id,
				linkText: "View",
			});
			let changetenantId = userInfo.tenantId ? userInfo.tenantId.split(".")[0] : "ch";
			let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
			let fileUrls =
				fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,changetenantId) : {};


			documentsPreview = documentsPreview.map(function (doc, index) {
				doc["link"] =
					(fileUrls &&
						fileUrls[doc.fileStoreId] &&
						fileUrls[doc.fileStoreId].split(",")[0]) ||
					"";

				doc["name"] =
					(fileUrls[doc.fileStoreId] &&
						decodeURIComponent(
							fileUrls[doc.fileStoreId]
								.split(",")[0]
								.split("?")[0]
								.split("/")
								.pop()
								.slice(13)
						)) ||
					`Document - ${index + 1}`;
				return doc;
			});
			setTimeout(() => {
				window.open(documentsPreview[0].link);
			}, 100);
			prepareFinalObject('documentsPreview', documentsPreview)
		}



	}

GOTOPAY = (selectedNumber) => {
	this.props.history.push(`/egov-services/PaymentReceiptDteail/${selectedNumber}`);
}

continue = () => {

	let { selectedComplaint,toggleSnackbarAndSetText } = this.props;

	let bookingDate = selectedComplaint.bkFromDate
   console.log("FromDate--yyy",bookingDate)
	
	let dateFromDate = new Date(bookingDate)
	console.log("dateFromDate--",dateFromDate)
	let CurrentDate = new Date();
	console.log("CurrentDate--",CurrentDate)

   let Difference_In_Time_check = dateFromDate.getTime() - CurrentDate.getTime();
   console.log("Difference_In_Time--uuuuu",Difference_In_Time_check)
	  // To calculate the no. of days between two dates
   let Difference_In_Days_check = Difference_In_Time_check / (1000 * 3600 * 24);
   console.log("Difference_In_Days--",Difference_In_Days_check)
	 if(Difference_In_Days_check === 1 || Difference_In_Days_check > 1){
		this.props.history.push(`/egov-services/checkavailability_pcc`);
	 }
else{
	toggleSnackbarAndSetText(
		true,
		{
		  labelName: "You Can Change Till Before One Day Of Booking",
		  labelKey: `You Can Change Till Before One Day Of Booking`
		},
		"error"
	  );
  }
}

ApplyOfflineSecurityRefund = async () =>{
	alert("ComeInRefundEmpBooking")
	let {selectedComplaint} = this.props
	console.log("propsInCancelEmpBooking--",selectedComplaint)
	
		let Booking= {
			"bkRemarks": null,
			"timeslots": [],
			"reInitiateStatus": false,
			"bkApplicationNumber": selectedComplaint.bkApplicationNumber,
			"bkHouseNo": selectedComplaint.bkHouseNo,
			"bkAddress": null,
			"bkSector": selectedComplaint.bkSector,
			"bkVillCity": null,
			"bkAreaRequired": null,
			"bkDuration": null,
			"bkCategory": null,
			"bkEmail": selectedComplaint.bkEmail,
			"bkContactNo": null,
			"bkDocumentUploadedUrl": null,
			"bkDateCreated": selectedComplaint.bkDateCreated,
			"bkCreatedBy": null,
			"bkWfStatus": null,
			"bkAmount": null,
			"bkPaymentStatus": selectedComplaint.bkPaymentStatus,
			"bkBookingType": selectedComplaint.bkBookingType,
			"bkFromDate": selectedComplaint.bkFromDate,
			"bkToDate": selectedComplaint.bkToDate,
			"bkApplicantName": selectedComplaint.bkApplicantName,
			"bkBookingPurpose": selectedComplaint.bkBookingPurpose,
			"bkVillage": null,
			"bkDimension": selectedComplaint.bkDimension,
			"bkLocation": selectedComplaint.bkLocation,
			"bkStartingDate": null,
			"bkEndingDate": null,
			"bkType": null,
			"bkResidenceProof": null,
			"bkCleansingCharges": selectedComplaint.bkCleansingCharges,
			"bkRent": selectedComplaint.bkRent,
			"bkSurchargeRent": selectedComplaint.bkSurchargeRent,
			"bkFacilitationCharges": null,
			"bkUtgst": selectedComplaint.bkUtgst,
			"bkCgst": selectedComplaint.bkCgst,
			"bkMobileNumber": selectedComplaint.bkMobileNumber,
			"bkCustomerGstNo": null,
			"bkCurrentCharges": null,
			"bkLocationChangeAmount": null,
			"bkVenue": null,
			"bkDate": null,
			"bkFatherName": null,
			"bkBookingVenue": selectedComplaint.bkBookingVenue,
			"bkBookingDuration": null,
			"bkIdProof": null,
			"bkApplicantContact": null,
			"bkOpenSpaceLocation": null,
			"bkLandmark": null,
			"bkRequirementArea": null,
			"bkLocationPictures": null,
			"bkParkOrCommunityCenter": null,
			"bkRefundAmount": null,
			"bkPropertyOwnerName": null,
			"bkCompleteAddress": null,
			"bkResidentialOrCommercial": null,
			"bkMaterialStorageArea": null,
			"bkPlotSketch": null,
			"bkApplicationStatus": selectedComplaint.bkApplicationStatus,
			"bkTime": null,
			"bkStatusUpdateRequest": null,
			"bkStatus": null,
			"bkDriverName": null,
			"bkVehicleNumber": null,
			"bkEstimatedDeliveryTime": null,
			"bkActualDeliveryTime": null,
			"bkNormalWaterFailureRequest": null,
			"bkUpdateStatusOption": null,
			"bkAddSpecialRequestDetails": null,
			"bkBookingTime": null,
			"bkApprovedBy": null,
			"bkModuleType": null,
			"uuid": null,
			"tenantId": selectedComplaint.tenantId,
			"bkAction": "OFFLINE_SECURITY_REFUND",
			"bkConstructionType": null,
			"businessService": selectedComplaint.businessService,
			"bkApproverName": null,
			"discount": null,
			"assignee": null,
			"wfDocuments": [],
			"financialYear": selectedComplaint.financialYear,
			"financeBusinessService": null
		  }
	console.log("CancelEmpBooking-Booking",Booking)
		  let createAppData = { 
			"applicationType": "PACC",
			"applicationStatus": "",
			"applicationId": selectedComplaint.bkApplicationNumber ? selectedComplaint.bkApplicationNumber : null,
			"tenantId": selectedComplaint.tenantId,
			"Booking": Booking   
		}
	console.log("createAppData--createAppData",createAppData)
		let payloadfund = await httpRequest(
			"bookings/park/community/_update",
			"_search",[],
			createAppData
			);
	console.log("payloadfund--cancel--",payloadfund)
	this.props.history.push(`/egov-services/apply-refund-success`);
	}

TotalPACCDays =() => {
	let { selectedComplaint,toggleSnackbarAndSetText } = this.props;
	let bookingDate = selectedComplaint.bkFromDate
	let check;

	console.log("FromDate--yyy-jjj",bookingDate)
	 
	 let dateFromDate = new Date(bookingDate)
	 console.log("dateFromDate--gg",dateFromDate)
	 let CurrentDate = new Date();
	 console.log("CurrentDate--",CurrentDate)

if(dateFromDate < CurrentDate){
	check = true
}
else{
	check = false	
}
 console.log("hjhjhjjhjhj--",check)
	let Difference_In_Time_check = dateFromDate.getTime() - CurrentDate.getTime();
	console.log("Difference_In_Time--uuuuu-fgfgfg",Difference_In_Time_check)
	   // To calculate the no. of days between two dates
	let Difference_In_Days_check = Difference_In_Time_check / (1000 * 3600 * 24);
	console.log("Difference_In_Days--dadada",Difference_In_Days_check)
	this.setState({
		checkGreaterDate : check,
		checkNumDays : Difference_In_Days_check
	})

	return Difference_In_Time_check

}

// CheckGreaterDate = () =>{
// 	let { selectedComplaint,toggleSnackbarAndSetText } = this.props;
// 	let check;
// 	let bookingDate = selectedComplaint.bkFromDate
// 	console.log("FromDate--yyy-last",bookingDate)

// 	let dateFromDate = new Date(bookingDate)
// 	console.log("dateFromDate--gg",dateFromDate)
// 	let CurrentDate = new Date();
// 	console.log("CurrentDate--",CurrentDate)
// if(dateFromDate > CurrentDate){
// 	check == false
// }
// else{
// 	check == true	
// }
// console.log("ValueOfCheckInFunction--",check)
// this.setState({
// 	checkGreaterDate: check,			
// })

// return check
// }


	render() {
		const dropbordernone = {
			float: "right",
			paddingRight: "20px"

		};
		let { shareCallback } = this;
		let { comments, openMap,AppName,checkNumDays,checkGreaterDate} = this.state;
		console.log("CheckstateForRefund--",this.state)
		let { complaint, timeLine } = this.props.transformedComplaint;
		let { documentMap,selectedComplaint,Difference_In_Days_check,first } = this.props;
		let { historyApiData, paymentDetails, match, userInfo,paymentDetailsForReceipt,PayMentTwo,PayMentOne,selectedNumber } = this.props;
		console.log("this.props.match--",this.props)
		console.log("this.state.totalRefundAmount",this.state.totalRefundAmount)
		let {
			role,
			serviceRequestId,
			history,
			isAssignedToEmployee,
			reopenValidChecker
		} = this.props;

// var ForAllNoDays = this.TotalPACCDays();
// console.log("ForAllNoDays--",ForAllNoDays)

// var check = this.CheckGreaterDate();
// console.log("CheckGreaterDat--",check)
		let btnOneLabel = "";
		let btnTwoLabel = "";
		let action;
		let complaintLoc = {};

		if (complaint) {
			if (role === "ao") {

			}
			else if (role === "employee") {
				btnOneLabel = "BK_MYBK_REJECT_BUTTON";
				btnTwoLabel = "BK_MYBK_RESOLVE_MARK_RESOLVED";

			}
		}
		if (timeLine && timeLine[0]) {
			action = timeLine[0].action;
		}
		const foundFirstLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_CLERK' || el.code === 'BK_DEO');
		const foundSecondLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_SENIOR_ASSISTANT');
		const foundThirdLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_AUDIT_DEPARTMENT');
		const foundFourthLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_CHIEF_ACCOUNT_OFFICER');
		const foundFifthLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_PAYMENT_PROCESSING_AUTHORITY');
		const foundSixthLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_E-SAMPARK-CENTER');
		const foundSevenLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_SUPERVISOR');
		const foundEightLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_OSD');
		const foundNineLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_OSD');



		return (
			<div>
				<Screen>
					{complaint && !openMap && (
						<div>
							{console.log("matchOne--",match)}
							{console.log("matchparms--",this.props.match)}
							<div className="form-without-button-cont-generic">
								<div className="container" >
									<div className="row">
										<div className="col-12 col-md-6" style={{ fontSize: '26px' }}>
											{/* <Label style={{ fontSize: '26px',marginTop: '10px' }} label="BK_MYBK_APPLICATION_DETAILS" /> */}
											Application Details
										</div>
										<div className="col-12 col-md-6 row">
											<div class="col-12 col-md-6 col-sm-3" >
												<ActionButtonDropdown data={{
													label: { labelName: "Download ", labelKey: "BK_COMMON_DOWNLOAD_ACTION" },
													rightIcon: "arrow_drop_down",
													leftIcon: "cloud_download",
													props: {
														variant: "outlined",
														style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
													},
													menu: (complaint.bkPaymentStatus == 'SUCCESS') ? [{
														label: {
															labelName: "Receipt",
															labelKey: "BK_MYBK_DOWNLOAD_RECEIPT"
														},

														link: () => this.downloadPaymentReceiptButton('Receipt'),
														leftIcon: "receipt"
													},
													{
														label: {
															labelName: "PermissionLetter",
															labelKey: "BK_MYBK_DOWNLOAD_PERMISSION_LETTER"
														},
														link: () => this.downloadPermissionLetterButton('PermissionLetter'),
														leftIcon: "book"
													}, 
													{
														label: {
															labelName: "Application",
															labelKey: "BK_MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationButton('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													}] :
														[{
															label: {
																labelName: "Receipt",
																labelKey: "BK_MYBK_DOWNLOAD_RECEIPT"
															},
	
															link: () => this.downloadPaymentReceiptButton('Receipt'),
															leftIcon: "receipt"
														},
														{
															label: {
																labelName: "PermissionLetter",
																labelKey: "BK_MYBK_DOWNLOAD_PERMISSION_LETTER"
															},
															link: () => this.downloadPermissionLetterButton('PermissionLetter'),
															leftIcon: "book"
														}, 
														{
															label: {
																labelName: "Application",
																labelKey: "BK_MYBK_PRINT_APPLICATION"
															},
															link: () => this.downloadApplicationButton('state', "dispatch", 'REJECT'),
															leftIcon: "assignment"
														}]
												}} />
											</div>
											<div class="col-12 col-md-6 col-sm-3" >
												<ActionButtonDropdown data={{
													label: { labelName: "Print", labelKey: "BK_COMMON_PRINT_ACTION" },
													rightIcon: "arrow_drop_down",
													leftIcon: "print",
													props: {
														variant: "outlined",
														style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
													},
													menu: (complaint.status == 'APPROVED') ? [{
														label: {
															labelName: "Receipt",
															labelKey: "BK_MYBK_PRINT_RECEIPT"
														},

														link: () => this.downloadPaymentReceiptButton('Receipt'),
														leftIcon: "receipt"
													},
													{
														label: {
															labelName: "PermissionLetter",
															labelKey: "BK_MYBK_DOWNLOAD_PERMISSION_LETTER"
														},
														link: () => this.downloadPermissionLetterButton('state', "dispatch", 'REJECT'),
														leftIcon: "book"
													}, {
														label: {
															labelName: "Application",
															labelKey: "BK_MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationButton('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													}] : [{
														label: {
															labelName: "Application",
															labelKey: "BK_MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationButton('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													}]
												}} />

											</div>
										</div>
									</div>
								</div>

								<OSMCCBookingDetails
									{...complaint}
									historyApiData={historyApiData && historyApiData}
								/>

								<AppDetails
									{...complaint}

								/>

								<BookingDetails
									{...complaint}
									historyApiData={historyApiData && historyApiData}
								/>
								
								<UserBankDetails
									{...complaint}
								/>
								{this.state.CheckStatus != "OFFLINE_MODIFIED" ? <PaymentDetails
									paymentDetails={paymentDetails && paymentDetails}
									PayMentTwo={PayMentTwo && PayMentTwo}
									PayMentOne={PayMentOne && PayMentOne}

								/> : " "}
								
								
{this.state.CheckStatus == "OFFLINE_MODIFIED" ? 
<div>
<PaymentDetailFirstModified 
paymentDetails={this.state.modifiedFirstAmount && this.state.modifiedFirstAmount}
/>
<AppStateModifiedPayDetail 
paymentDetails={this.state.fullAmountDetail && this.state.fullAmountDetail}
/>
</div>
: " "}

							 {this.state.refundCard == true ? <RefundCard 
							paymentDetails={this.state.newPaymentDetails != "NotFound" && this.state.newPaymentDetails}
							RefAmount={this.state.totalRefundAmount && this.state.totalRefundAmount}
							payload={paymentDetailsForReceipt}
							 {...complaint}		 
							 /> : " "}

								<div style={{
									height: "100px",
									width: "100",
									backgroundColor: "white",
									border: "2px solid white",
									boxShadow: "0 0 2px 2px #e7dcdc", paddingLeft: "30px", paddingTop: "10px"
								}}><b>Documents</b><br></br>

									{documentMap && Object.values(documentMap) ? Object.values(documentMap) : "Not found"}
									<button className="ViewDetailButton" data-doc={documentMap} onClick={(e) => { this.callApiForDocumentData(e) }}>VIEW</button>
								</div>

								<Comments
									comments={comments}
									role={role}
									isAssignedToEmployee={isAssignedToEmployee}
								/>
							</div>
							<div style={{
								paddingTop: "30px",
								paddingRight: "30px", float: "right",
							}}>
								{(role === "ao" &&
									complaint.complaintStatus.toLowerCase() !== "closed") ||
									(role === "eo" &&
										(complaint.status.toLowerCase() === "escalatedlevel1pending" ||
											complaint.status.toLowerCase() === "escalatedlevel2pending" ||
											complaint.status.toLowerCase() === "assigned")) ||
									(role === "employee" &&
										(
											(complaint.status == "PENDING_FOR_APPROVAL_CLEARK_DEO" && foundFirstLavel &&
												<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
													label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
													rightIcon: "arrow_drop_down",
													props: {
														variant: "outlined",
														style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
													},
													menu: [{
														label: {
															labelName: "Approve",
															labelKey: "BK_MYBK_APPROVE_ACTION_BUTTON"
														},

														link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
													},
													{
														label: {
															labelName: "Reject",
															labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
														},
														link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
													}
													
												]
												}} />
												}
												></Footer>
						// 						<button
                        // onClick={(e)=>this.GOTOPAY(selectedNumber)}
                        // >PAY </button>
											)

										)
									)}
								{(role === "employee" &&

									(complaint.status == "PENDING_FOR_APPROVAL_SENIOR_ASSISTANT" && foundSecondLavel &&

										<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
											label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
											rightIcon: "arrow_drop_down",
											props: {
												variant: "outlined",
												style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
											},
											menu: [{
												label: {
													labelName: "Approve",
													labelKey: "BK_MYBK_APPROVE_ACTION_BUTTON"
												},

												link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
											},
											{
												label: {
													labelName: "Reject",
													labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
												},
												link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
											}]
										}} />}></Footer>

									)
								)}
								{(role === "employee" &&

									(complaint.status == "PENDING_FOR_APPROVAL_AUDIT_DEPARTMENT" && foundThirdLavel &&

										<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
											label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
											rightIcon: "arrow_drop_down",
											props: {
												variant: "outlined",
												style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
											},
											menu: [{
												label: {
													labelName: "Approve",
													labelKey: "BK_MYBK_APPROVE_ACTION_BUTTON"
												},

												link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
											},
											{
												label: {
													labelName: "Reject",
													labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
												},
												link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
											}]
										}} />}></Footer>

									)
								)}
								{(role === "employee" &&

									(complaint.status == "PENDING_FOR_APPROVAL_CAO" && foundFourthLavel &&

										<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
											label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
											rightIcon: "arrow_drop_down",
											props: {
												variant: "outlined",
												style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
											},
											menu: [{
												label: {
													labelName: "Approve",
													labelKey: "BK_MYBK_APPROVE_ACTION_BUTTON"
												},

												link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
											},
											{
												label: {
													labelName: "Reject",
													labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
												},
												link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
											}]
										}} />}></Footer>

									)
								)}
{/*sixStep*/}
{(role === "employee" &&
(complaint.status == "OFFLINE_APPLIED" && foundSixthLavel &&
<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={
      <div className="col-sm-12 col-xs-12" style={{textAlign: 'right'}}>
		  {/*Cancel Button    checkNumDays,checkGreaterDate*/}  
		  {(Difference_In_Days_check > 15 || Difference_In_Days_check == 15 )? 
		  <Button
		  label={
			<Label
			  buttonLabel={true}
			  color="#fe7a51"
			  label="CANCEL BOOKING"
			/>
		  }
		  labelStyle={{
			letterSpacing: 0.7,
			padding: 0,
			color: "#fe7a51"
		  }}
		  buttonStyle={{ border: "1px solid #fe7a51" }}
		  style={{ width: "15%" }}
		  onClick={() => this.CancelEmpBooking()}
		/> 
		  : ""}
		  
					  {/*Date Venue Change*/}

					  {(Difference_In_Days_check > 1 || Difference_In_Days_check == 1)? 
					  <Button
					  label={
						<Label
						  buttonLabel={true}
						  color="#fe7a51"
						  label="CHANGE DATE/VENUE"
						/>
					  }
					  labelStyle={{
						letterSpacing: 0.7,
						padding: 0,
						color: "#fe7a51",
					  }}
					  buttonStyle={{ border: "1px solid #fe7a51" }}
					  style={{ width: "15%", marginLeft: "2%"}}
					  onClick={() => this.continue()}
					/> 
					  :""}
		 
{/*Security Refund*/}
{first == true ? 
 <Button
 label={
   <Label
	 buttonLabel={true}
	 color="#fe7a51"
	 label="SECURITY REFUND"
   />
 }
 labelStyle={{
   letterSpacing: 0.7,
   padding: 0,
   color: "#fe7a51",
 }}
 buttonStyle={{ border: "1px solid #fe7a51" }}
 style={{ width: "15%", marginLeft: "2%"}}
 onClick={() => this.ApplyOfflineSecurityRefund()}
/>
:""}
                   			  
       
        </div> 
       }></Footer>

				)
			)}
{/*sixStep*/}

{(role === "employee" &&

									(complaint.status == "PENDING_FOR_APPROVAL_SUPERVISOR" && foundSevenLavel &&

										<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
											label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
											rightIcon: "arrow_drop_down",
											props: {
												variant: "outlined",
												style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
											},
											menu: [{
												label: {
													labelName: "Approve",
													labelKey: "BK_MYBK_APPROVE_ACTION_BUTTON"
												},

												link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
											},
											{
												label: {
													labelName: "Reject",
													labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
												},
												link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
											}]
										}} />}></Footer>

									)
								)}
								{(role === "employee" &&

(complaint.status == "PENDING_FOR_APPROVAL_OSD" && foundEightLavel &&

	<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
		label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
		rightIcon: "arrow_drop_down",
		props: {
			variant: "outlined",
			style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
		},
		menu: [{
			label: {
				labelName: "Approve",
				labelKey: "BK_MYBK_APPROVE_ACTION_BUTTON"
			},

			link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
		},
		{
			label: {
				labelName: "Reject",
				labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
			},
			link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
		}]
	}} />}></Footer>

)
)}


								{(role === "employee" &&

									(complaint.status == "PENDING_FOR_DISBURSEMENT" && foundFifthLavel &&

										<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
											label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
											rightIcon: "arrow_drop_down",
											props: {
												variant: "outlined",
												style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
											},
											menu: [{
												label: {
													labelName: "PAY",
													labelKey: "PAY"
												},

												link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
											},
											{
												label: {
													labelName: "Reject",
													labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
												},
												link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
											}]
										}} />}></Footer>

									)
								)}
{console.log("match.params.applicationId--",match.params.applicationId)}
								<DialogContainer
									toggle={this.state.togglepopup}
									actionTittle={this.state.actionTittle}
									togglepopup={this.actionButtonOnClick}
									maxWidth={'md'}
									children={this.state.actionOnApplication == 'APPROVED' ? <ApproveCancellation
										applicationNumber={match.params.applicationId}
										matchparams={match.params}
										match={this.props.match}
										selectedComplaint={this.props.selectedComplaint}
										userInfo={userInfo}
										payload={paymentDetailsForReceipt}
										payloadTwo={this.props.paymentDetailsForReceipt}
									/> : <RejectCancellation
											applicationNumber={match.params.applicationId}
											userInfo={userInfo}
										/>}
								/>

							</div>
						</div>
					)}
				</Screen>
			</div>
		);
	}
}

const roleFromUserInfo = (roles = [], role) => {
	const roleCodes = roles.map((role, index) => {
		return role.code;
	});
	return roleCodes && roleCodes.length && roleCodes.indexOf(role) > -1
		? true
		: false;
};

const mapCitizenIdToMobileNumber = (citizenObjById, id) => {
	return citizenObjById && citizenObjById[id]
		? citizenObjById[id].mobileNumber
		: "";
};
let gro = "";

const mapStateToProps = (state, ownProps) => {
	const { bookings, common, auth, form } = state;
	const {DownloadReceiptDetailsforPCC} = bookings;

	const { applicationData, createPACCApplicationData,Downloadesamparkdetails,Downloadesamparkdetailspl} = bookings;
	const { DownloadPaymentReceiptDetails, DownloadApplicationDetails, DownloadPermissionLetterDetails} = bookings;
	const { id } = auth.userInfo;
	const { employeeById, departmentById, designationsById, cities } =
		common || {};

	const { userInfo } = state.auth;
	const serviceRequestId = ownProps.match.params.applicationId;
	let selectedComplaint = applicationData ? applicationData.bookingsModelList[0] : ''
	let selectedNumber = selectedComplaint ? selectedComplaint.bkApplicationNumber : "NotFoundAnyApplicationNumber"
	console.log("selectedNumber--",selectedNumber)

	let bookFDate = selectedComplaint ? selectedComplaint.bkFromDate : ""
	console.log("bookFDate--",bookFDate)

	let bookTDate = selectedComplaint ? selectedComplaint.bkToDate: ""
	console.log("bookTDate--",bookTDate)
	
	let dateFromDate = new Date(bookFDate)
	console.log("dateFromDate--gg",dateFromDate)

	let Todaydate = new Date();
	console.log("Todaydate--",Todaydate)

	let first = false;
	if(dateFromDate < Todaydate){
		first = true
	}
console.log("first--",first)

let Difference_In_Time_check = dateFromDate.getTime() - Todaydate.getTime();
console.log("Difference_In_Time--uuuuu-fgfgfg",Difference_In_Time_check)
   // To calculate the no. of days between two dates
let Difference_In_Days_check = Difference_In_Time_check / (1000 * 3600 * 24);
console.log("Difference_In_Days--dadada",Difference_In_Days_check)

/*
 let dateFromDate = new Date(bookingDate)
	 console.log("dateFromDate--gg",dateFromDate)
	 let CurrentDate = new Date();
	 console.log("CurrentDate--",CurrentDate)
*/
	let businessService = applicationData ? applicationData.businessService : "";
	let bookingDocs;
	let documentMap = applicationData && applicationData.documentMap ? applicationData.documentMap : '';
	const { HistoryData } = bookings;
	let historyObject = HistoryData ? HistoryData : ''
	const { paymentData } = bookings;
	console.log("paymentData--",paymentData ? paymentData : "NopaymentData")


	const { fetchPaymentAfterPayment } = bookings;
	console.log("fetchPaymentAfterPayment--",fetchPaymentAfterPayment ? fetchPaymentAfterPayment : "NofetchPaymentAfterPaymentData")

	let paymentDetailsForReceipt = fetchPaymentAfterPayment;
	let paymentDetails;
	
	let PayMentOne = fetchPaymentAfterPayment && fetchPaymentAfterPayment.Payments[0] && fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill;
	let xyz = PayMentOne && PayMentOne ? PayMentOne : "xyz";
	console.log("xyz--",xyz)
	console.log("PayMentOne--",PayMentOne)
	let PayMentTwo = paymentData ? paymentData.Bill[0] : '';
	console.log("PayMentTwo--",PayMentTwo)
	let abc = PayMentTwo && PayMentTwo ? PayMentTwo : "abc"
	console.log("abc--",abc)
	
if(selectedComplaint && selectedComplaint.bkApplicationStatus == "OFFLINE_APPLIED"){
console.log("offlineApplied--",selectedComplaint.bkApplicationStatus)
   if(selectedComplaint.bkPaymentStatus == "SUCCESS"){
      console.log("one")
	paymentDetails = fetchPaymentAfterPayment && fetchPaymentAfterPayment.Payments[0] && fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill;
     console.log("paymentDetails-One--",paymentDetails)
}
else{
	console.log("two")
	paymentDetails = paymentData ? paymentData.Bill[0] : '';
	console.log("paymentDetails-two--",paymentDetails)
    }
}
  else{
	paymentDetails = fetchPaymentAfterPayment && fetchPaymentAfterPayment.Payments[0] && fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill;
  }

  let refConAmount = fetchPaymentAfterPayment ? fetchPaymentAfterPayment : "NotFound"
  console.log("refConAmount",refConAmount)

  let ReceiptPaymentDetails = fetchPaymentAfterPayment;
  console.log("ReceiptPaymentDetails--",ReceiptPaymentDetails)

  let offlinePayementMode = ReceiptPaymentDetails ? ReceiptPaymentDetails.Payments[0].paymentMode : "NotFound"
  console.log("offlinePayementMode--",offlinePayementMode)
	  
//transactionDate
let offlineTransactionDate = ReceiptPaymentDetails ? ReceiptPaymentDetails.Payments[0].transactionDate : "NotFound"
console.log("offlineTransactionDate--",offlineTransactionDate) 


let offlineTransactionNum = ReceiptPaymentDetails ? ReceiptPaymentDetails.Payments[0].transactionNumber : "NotFound"
console.log("offlineTransactionNum--",offlineTransactionNum) 
//receipt Number

let recNumber = ReceiptPaymentDetails ? ReceiptPaymentDetails.Payments[0].paymentDetails[0].receiptNumber : "NotFound"
console.log("recNumber--",recNumber)

let billAccountDetailsArray =  ReceiptPaymentDetails ? ReceiptPaymentDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails : "NOt found Any Array"
console.log("billAccountDetailsArray--",billAccountDetailsArray)
let one = 0;
let two = 0;
let three = 0;
let four = 0;
let five = 0;
let six = 0;
for(let i = 0; i < billAccountDetailsArray.length ; i++ ){

if(billAccountDetailsArray[i].taxHeadCode == "PACC"){
    one = billAccountDetailsArray[i].amount
}
else if(billAccountDetailsArray[i].taxHeadCode == "LUXURY_TAX"){
    two = billAccountDetailsArray[i].amount
}
else if(billAccountDetailsArray[i].taxHeadCode == "REFUNDABLE_SECURITY"){
    three = billAccountDetailsArray[i].amount
}
else if(billAccountDetailsArray[i].taxHeadCode == "PACC_TAX"){
    four = billAccountDetailsArray[i].amount
}
else if(billAccountDetailsArray[i].taxHeadCode == "PACC_ROUND_OFF"){
    five = billAccountDetailsArray[i].amount
}
else if(billAccountDetailsArray[i].taxHeadCode == "FACILITATION_CHARGE"){
    six = billAccountDetailsArray[i].amount
}
}


	let historyApiData = {}
	if (historyObject) {
		historyApiData = historyObject;
	}

	const role =
		roleFromUserInfo(userInfo.roles, "GRO") ||
			roleFromUserInfo(userInfo.roles, "DGRO")
			? "ao"
			: roleFromUserInfo(userInfo.roles, "ESCALATION_OFFICER1") ||
				roleFromUserInfo(userInfo.roles, "ESCALATION_OFFICER2")
				? "eo"
				: roleFromUserInfo(userInfo.roles, "CSR")
					? "csr"
					: "employee";

	let isAssignedToEmployee = true;
	if (selectedComplaint && businessService) {

		let details = {
			applicantName: selectedComplaint.bkApplicantName,
			status: selectedComplaint.bkApplicationStatus,
			applicationNo: selectedComplaint.bkApplicationNumber,
			address: selectedComplaint.bkCompleteAddress,
			bookingType: selectedComplaint.bkBookingType,
			sector: selectedComplaint.bkSector,
			bkEmail: selectedComplaint.bkEmail,
			bkMobileNumber: selectedComplaint.bkMobileNumber,
			houseNo: selectedComplaint.bkHouseNo,
			dateCreated: selectedComplaint.bkDateCreated,
			areaRequired: selectedComplaint.bkAreaRequired,
			bkDuration: selectedComplaint.bkDuration,
			bkCategory: selectedComplaint.bkCategory,
			constructionType: selectedComplaint.bkConstructionType,
			villageCity: selectedComplaint.bkVillCity,
			residentialCommercial: selectedComplaint.bkType,
			businessService: selectedComplaint.businessService,
			bkConstructionType: selectedComplaint.bkConstructionType,
			bkFromDate: selectedComplaint.bkFromDate,
			bkToDate: selectedComplaint.bkToDate,
			bkBookingPurpose: selectedComplaint.bkBookingPurpose,
			bkDimension: selectedComplaint.bkDimension,
			bkLocation: selectedComplaint.bkLocation,
			tenantId: selectedComplaint.tenantId
		}
	
		let transformedComplaint;
		if (applicationData != null && applicationData != undefined) {

			transformedComplaint = {
				complaint: details,
			};
		}
		const { localizationLabels } = state.app;
		const complaintTypeLocalised = getTranslatedLabel(
			`SERVICEDEFS.${transformedComplaint.complaint.complaint}`.toUpperCase(),
			localizationLabels
		);

		return {
			paymentDetails,offlineTransactionNum,recNumber,six,one,DownloadReceiptDetailsforPCC,refConAmount,
			offlineTransactionDate,
			historyApiData,
			DownloadPaymentReceiptDetails,
			paymentDetailsForReceipt, DownloadApplicationDetails, DownloadPermissionLetterDetails,
			documentMap,
			form,
			transformedComplaint,
			role,
			serviceRequestId,
			isAssignedToEmployee,
			complaintTypeLocalised,
			Downloadesamparkdetailspl,
			Downloadesamparkdetails,
			selectedComplaint,
			userInfo,
			PayMentOne,
			PayMentTwo,
			selectedNumber,
			offlinePayementMode,Difference_In_Days_check,first
		};
	} else {
		return {
			paymentDetails,offlineTransactionNum,recNumber,six,one,DownloadReceiptDetailsforPCC,refConAmount,
			offlinePayementMode,Difference_In_Days_check,first,
			offlineTransactionDate,
			historyApiData,
			DownloadPaymentReceiptDetails,
			paymentDetailsForReceipt, DownloadApplicationDetails, DownloadPermissionLetterDetails,
			documentMap,
			form,
			transformedComplaint: {},
			role,
			serviceRequestId,
			isAssignedToEmployee,
			Downloadesamparkdetailspl,
			Downloadesamparkdetails,
			selectedComplaint,
			userInfo,
			PayMentOne,
			PayMentTwo,
			selectedNumber
		};
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchApplications: criteria => dispatch(fetchApplications(criteria)), //fetchResponseForRefdunf
		// fetchResponseForRefdunf: criteria => dispatch(fetchResponseForRefdunf(criteria)),
		fetchPayment: criteria => dispatch(fetchPayment(criteria)),
		fetchDataAfterPayment: criteria => dispatch(fetchDataAfterPayment(criteria)),

		downloadReceiptForPCC: criteria => dispatch(downloadReceiptForPCC(criteria)),
		downloadPLForPCC: criteria => dispatch(downloadPLForPCC(criteria)),
		downloadAppForPCC: criteria => dispatch(downloadAppForPCC(criteria)),
		fetchHistory: criteria => dispatch(fetchHistory(criteria)),
		resetFiles: formKey => dispatch(resetFiles(formKey)),
		sendMessage: message => dispatch(sendMessage(message)),
		sendMessageMedia: message => dispatch(sendMessageMedia(message)),
		prepareFormData: (jsonPath, value) =>
			dispatch(prepareFormData(jsonPath, value)),
		prepareFinalObject: (jsonPath, value) =>
			dispatch(prepareFinalObject(jsonPath, value)),
			downloadEsamparkApp: criteria => dispatch(downloadEsamparkApp(criteria)),  
			downloadEsamparkPL: criteria => dispatch(downloadEsamparkPL(criteria)),
		toggleSnackbarAndSetText: (open, message, error) =>
			dispatch(toggleSnackbarAndSetText(open, message, error)),

	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ApplicationDetails);