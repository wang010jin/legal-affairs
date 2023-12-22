<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.landray.kmss.util.MD5Util,com.landray.kmss.util.UserUtil" %>
<%
	String loginName = UserUtil.getUser().getFdLoginName();
	String key = "8ee8d2fc05f16ea90f4e4bdc0fc87a1f";
	String type = request.getParameter("type");
	String path = "";
	if("1".equals(type)){ //目标成本
		path = "%2fIndex.aspx%3fFrom%3dOA%26FunctionCode%3d02010204%26Application%3d0201";
	}else if("2".equals(type)){ // 合约规划
		path = "%2fIndex.aspx%3fFrom%3dOA%26FunctionCode%3d02010205%26Application%3d0201";
	}else if("3".equals(type)){ // 合同登记
		path = "%2fIndex.aspx%3fFrom%3dOA%26FunctionCode%3d02010304%26Application%3d0201";
	}else if("4".equals(type)){ // 变更管理
		path = "%2fIndex.aspx%3fFrom%3dOA%26FunctionCode%3d02010415%26Application%3d0201";
	}else if("5".equals(type)){ // 付款计划
		path = "%2fIndex.aspx%3fFrom%3dOA%26FunctionCode%3d02010405%26Application%3d0201";
	}else if("6".equals(type)){ // 付款登记
		path = "%2fIndex.aspx%3fFrom%3dOA%26FunctionCode%3d02010408%26Application%3d0201";
	}else if("7".equals(type)){ // 合同结算
		path = "%2fIndex.aspx%3fFrom%3dOA%26FunctionCode%3d02010402%26Application%3d0201";
	}else if("8".equals(type)){ // 合同台账
		path = "%2fIndex.aspx%3fFrom%3dOA%26FunctionCode%3d02010404%26Application%3d0201";
	}else if("9".equals(type)){ // 统计报表
		path = "%2fIndex.aspx%3fFrom%3dOA%26FunctionCode%3d02011999%26Application%3d0201";
	}else if("10".equals(type)){// 供应商管理 二次编码
		path = "%252fWebPage%252fSupplierManage%252fIndex.aspx%253fm%253dgysgl";
	}else if("11".equals(type)){// 采购计划管理 二次编码
		path = "%252fWebPage%252fPurchaseManage%252fPurchasePlan%252fPurchasePlan_Index.aspx%253fm%253dcggl";
	}else if("12".equals(type)){// 采购过程管理 二次编码
		path = "%252fWebPage%252fPurchaseManage%252fPurchaseProcess%252fPurchaseProcess_Index.aspx%253fm%253dcggl";
	}else if("13".equals(type)){ // 计划编制与调整
		path = "%2fIndex.aspx%3fFrom%3dOA%26FunctionCode%3d02020201%26Application%3d0202";
	}else if("14".equals(type)){ // 项目计划执行
		path = "%2fIndex.aspx%3fFrom%3dOA%26FunctionCode%3d02020207%26Application%3d0202";
	}else if("15".equals(type)){ // 项目阶段性成果
		path = "%2fIndex.aspx%3fFrom%3dOA%26FunctionCode%3d02020210%26Application%3d0202";
	}else if("16".equals(type)){  //明源销售流程中心
		path = "%2fIndex.aspx%3fFrom%3dOA%26FunctionCode%3d10010103%26Application%3d100101";
	}else if("17".equals(type)){  //明源成本流程中心
		path = "%2fIndex.aspx%3fFrom%3dOA%26FunctionCode%3d10010103%26Application%3d1001";
	}

	if(!"".equals(path)){
		if("16".equals(type)){
			String url = "http://192.168.10.21:8001/Slxt/Default_Login.aspx?Page="+path+"&usercode="+loginName+"&Ticket="+key;
			request.setAttribute("url", url);
		}else{
			if("10".equals(type)||"11".equals(type)||"12".equals(type)){
				path = "%2FSingleLogin%2FOpenCgZtb.aspx%3FUserCode%3D"+loginName+"%26url%3D"+path;
			}
			String url = "http://192.168.10.16:8008/cbgl/Default_Login.aspx?Page="+path+"&usercode="+loginName+"&Ticket="+key;
			request.setAttribute("url", url);
		}
	}
	
%>
<script>
	var url="${url}";
	if(url){
		window.location = url;
	}else{
		alert("进入异常，请联系管理员");
	}
</script>