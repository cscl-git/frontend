import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";

// const iconStyle = {
//   marginRight: "13px",
//   height: "24px",
//   width: "24px",
// };

// const imageStyles = {
//   maxHeight: "100px",
//   minHeight: "100px",
// };

// const mapIconStyle = {
//   marginRight: "7px",
//   height: "12px",
//   width: "14px",
//   borderRadius: "50%",
// };

class PayDetails extends Component {

  render() {  
  
    const { PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,FACILITATION_CHARGE,PACC_ROUND_OFF,bkPaymentDate, paymentDetails, bkPaymentReceiptNumber, bkPaymentStatus,PayMentOne,PayMentTwo } = this.props;

    return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline row">
                <div className="col-md-4">
                  <Label label="BK_MYBK_FEE_ESTIMATE" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                </div>
                <div style={{right: '50px',position: 'absolute'}}>
                  <h5><Label label="BK_TOTAL_AMOUNT" /></h5>
                  <h3 style={{marginTop: '-8px',fontSize: '28px',color: 'black'}}><b>Rs {paymentDetails ? paymentDetails.totalAmount : 'NA'}</b></h3>
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px',marginTop:30}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_EMP_PACC_ROUND_OFF" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{PACC_ROUND_OFF}</h5>
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK__EMP_LUXURY_TAX" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{LUXURY_TAX}</h5>
                </div>
              </div>
              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_EMP_REFUNDABLE_SECURITY" /> {/*BK_MYBK_TAX_RENT_PACC*/}
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{REFUNDABLE_SECURITY}</h5>
                </div>
              </div>
              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_EMP_PACC_TAX" /> {/*BK_MYBK_TAX_RENT_PACC*/}
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{PACC_TAX}</h5>
                </div>
              </div>

              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TAX_RENT_PACC" /> {/*BK_MYBK_TAX_RENT_PACC*/}
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{PACC}</h5>
                </div>
              </div>
              {FACILITATION_CHARGE !== 0 ? 
               <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
               <div className="col-sm-4 col-xs-12">
                 <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_FACILITATION_CHARGE" /> {/*BK_MYBK_TAX_RENT_PACC*/}
               </div>
               <div className="col-sm-4 col-xs-12">
                 <h5 style={{ textAlign: "right" }}>{FACILITATION_CHARGE}</h5>
               </div>
             </div>
              : "" }
             
              <div className="complaint-detail-detail-section-status row" style={{marginLeft:'-10px'}}>
                <hr class="MuiDividerLine" style={{ marginbottom: "16px" }}></hr>
                <div className="col-sm-4 col-xs-12">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TOTAL_AMOUNT" />
                </div>
                <div className="col-sm-4 col-xs-12">
                  <h5 style={{ textAlign: "right" }}>{paymentDetails ? paymentDetails.totalAmount : 'NA'}</h5>
                </div>
              </div>

            </div>
          }
        />
      </div>
    );
  }
}

export default PayDetails;