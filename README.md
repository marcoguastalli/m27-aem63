# MARCO27 AEM 6.3

=AEM 6.3
cd ~/dev/repository/git/m27-aem63-servers
mvn cq-start

= DEPLOY into AEM SERVERS
mvn clean cq:deploy -Dcq.server=http://localhost:6300
mvn clean cq:deploy -Dcq.server=http://localhost:6301

= BOOK
http://localhost:6300/editor.html/content/m27/book.html
http://localhost:6300/content/m27/book.html
http://localhost:6301/content/m27/book.html