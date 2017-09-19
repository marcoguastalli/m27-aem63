<%@page session="false"%><%--
  Overwriting the content.jsp from the super resource type to display a different text
  We use HTL exclusively therefore just include the content.html here!
--%><%@include file="/libs/foundation/global.jsp" %>
<cq:include script="content.html"/>
