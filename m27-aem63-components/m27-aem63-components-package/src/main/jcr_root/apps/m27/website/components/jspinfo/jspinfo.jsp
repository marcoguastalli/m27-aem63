<%@include file="/libs/foundation/global.jsp" %>
<h1>AEM6 JSP INFO</h1>
<ul>
<%
out.print("<li>currentPage           - " + currentPage + "</li>");
out.print("<li>currentPage.getPath() - " + currentPage.getPath() + "</li>");
out.print("<li>currentStyle          - " + currentStyle + "</li>");
%>
</ul>
<div>
  <ul>
    <li>http://localhost:6700/system/console/fsclassloader</li>
    <li>http://localhost:6700/system/console/fsclassloader?view=/org/apache/jsp/apps/m27/website/components/jspinfo/jspinfo_jsp.java</li>
  </ul>
</div>