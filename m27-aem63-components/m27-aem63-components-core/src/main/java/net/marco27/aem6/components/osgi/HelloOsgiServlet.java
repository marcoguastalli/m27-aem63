package net.marco27.aem6.components.osgi;

import static org.apache.sling.api.servlets.ServletResolverConstants.*;
import static org.osgi.framework.Constants.SERVICE_DESCRIPTION;

import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(service = { Servlet.class }, property = {
        SERVICE_DESCRIPTION + "=Hello OSGi Servlet",
        SLING_SERVLET_RESOURCE_TYPES + "=m27/website/osgi/helloservlet",
        SLING_SERVLET_METHODS + "=GET",
        SLING_SERVLET_EXTENSIONS + "=html" })
public class HelloOsgiServlet extends SlingSafeMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(HelloOsgiServlet.class);

    /**
     * http://localhost:6300/libs/m27/website/osgi/helloservlet/html.GET.servlet
     */
    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {
        final Resource resource = request.getResource();
        response.setContentType("text/plain");
        response.getWriter().write("resource = " + resource.getPath());
    }
}
