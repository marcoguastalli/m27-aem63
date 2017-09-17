package net.marco27.osgi.microservice.book;

import org.osgi.service.component.annotations.Component;

import com.drew.lang.annotations.NotNull;

@Component(service = BookService.class, immediate = true)
public class BookServiceImpl implements BookService {

    @Override
    public String getBookTitlebyPath(@NotNull final String path) {
        return "No Book found with path " + path;
    }
}
