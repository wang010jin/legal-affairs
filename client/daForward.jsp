<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="com.landray.kmss.util.MD5Util,com.landray.kmss.util.UserUtil" %>
<%
	String loginName = UserUtil.getUser().getFdLoginName();
	String type = request.getParameter("type");
	String path = "";
	if("1".equals(type)){
		path = "m%3DArchiveManage-ArchiveSearch%26navName%3D%E6%A1%A3%E6%A1%88%E7%AE%A1%E7%90%86%2Fm%3DArchiveManage-presetArchiveManage%26navName%3D%E6%A1%A3%E6%A1%88%E5%BD%95%E5%85%A5";
	}else if("2".equals(type)){
		path = "m%3DArchiveManage-ArchiveSearch%26navName%3D%E6%A1%A3%E6%A1%88%E7%AE%A1%E7%90%86%2Fm%3DArchiveManage-ArchiveSearch%26navName%3D%E6%A1%A3%E6%A1%88%E6%90%9C%E7%B4%A2";
	}else if("3".equals(type)){
		path = "m%3DArchiveManage-ArchiveSearch%26navName%3D%E6%A1%A3%E6%A1%88%E7%AE%A1%E7%90%86%2Fm%3DArchiveManage-WorkFlow-TodoList%26navName%3D%E6%B5%81%E7%A8%8B%E5%AE%A1%E6%89%B9%2Fm%3DArchiveManage-WorkFlow-TodoList%26navName%3D%E6%88%91%E7%9A%84%E5%BE%85%E5%8A%9E";
	}else if("4".equals(type)){
		path = "m%3DArchiveManage-ArchiveSearch%26navName%3D%E6%A1%A3%E6%A1%88%E7%AE%A1%E7%90%86%2Fm%3DArchiveManage-FondsManage%26navName%3D%E5%85%A8%E5%AE%97%E7%AE%A1%E7%90%86";
	}
	if(!"".equals(path)){
		if("1".equals(type)){
			String url = "http://ams.glorypty.com/archive/user/index#m=ArchiveManage-presetArchiveManage&userName="+loginName+"&path="+path;
			request.setAttribute("url", url);
		}else if("2".equals(type)){
			String url = "http://ams.glorypty.com/archive/user/index#m=ArchiveManage-ArchiveSearch&userName="+loginName+"&path="+path;
			request.setAttribute("url", url);
		}else if("3".equals(type)){
			String url = "http://ams.glorypty.com/archive/user/index#m=ArchiveManage-WorkFlow-TodoList&userName="+loginName+"&path="+path;
			request.setAttribute("url", url);
		}else if("4".equals(type)){
			String url = "http://ams.glorypty.com/archive/user/index#m=ArchiveManage-FondsManage&userName="+loginName+"&path="+path;
			request.setAttribute("url", url);
		}
		
	}
%>
<script>
	var url="${url}";
	if(url){
		window.location = url;
	}else{
		alert("您无该系统帐号，请联系管理员");
	}
</script>