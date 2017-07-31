# MARCO27 AEM 6.3

=AEM 6.3
cd ~/dev/repository/git/m27-aem63-servers
mvn cq-start

= DEPLOY into AEM SERVERS
mvn clean cq:deploy -Pserver-package-deploy -Dcq.server=http://localhost:6300
mvn clean cq:deploy -Pserver-package-deploy -Dcq.server=http://localhost:6301

= JSPINFO
http://localhost:6300/editor.html/content/m27/jspinfo.html
http://localhost:6300/content/m27/jspinfo.html
http://localhost:6301/content/m27/jspinfo.html

= HTLINFO
http://localhost:6300/editor.html/content/m27/htlinfo.html
http://localhost:6300/content/m27/htlinfo.html
http://localhost:6301/content/m27/htlinfo.html

= HTLTEMPLATE
http://localhost:6300/editor.html/content/m27/htltemplate.html
http://localhost:6300/content/m27/htltemplate.html
http://localhost:6301/content/m27/htltemplate.html